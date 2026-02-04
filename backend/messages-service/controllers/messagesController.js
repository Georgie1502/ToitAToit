const { randomUUID } = require("crypto");
const pool = require("../config/db");

const ensureParticipant = async ({ conversationId, userId }) => {
  const result = await pool.query(
    "SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2",
    [conversationId, userId],
  );
  return result.rows.length > 0;
};

exports.list = async (req, res) => {
  try {
    const userId = req.userId;

    const conversationId = (req.query.conversation_id || "").trim();
    const limit = Math.min(parseInt(req.query.limit || "50", 10), 200);
    const offset = Math.max(parseInt(req.query.offset || "0", 10), 0);

    // If a conversation_id is provided, return messages for that conversation.
    if (conversationId) {
      const ok = await ensureParticipant({ conversationId, userId });
      if (!ok) return res.status(403).json({ message: "Interdit" });

      const messages = await pool.query(
        `SELECT id, conversation_id, sender_user_id, body, created_at, read_at
        FROM messages
        WHERE conversation_id = $1
        ORDER BY created_at ASC
        LIMIT $2 OFFSET $3`,
        [conversationId, limit, offset],
      );

      return res.json({ conversation_id: conversationId, messages: messages.rows, limit, offset });
    }

    // Otherwise, return the user's conversations (with last message + participants).
    const result = await pool.query(
      `WITH my_conversations AS (
        SELECT c.id, c.listing_id, c.created_at
        FROM conversations c
        JOIN conversation_participants cp ON cp.conversation_id = c.id
        WHERE cp.user_id = $1
      ),
      participants AS (
        SELECT conversation_id, array_agg(user_id) AS participant_user_ids
        FROM conversation_participants
        WHERE conversation_id IN (SELECT id FROM my_conversations)
        GROUP BY conversation_id
      ),
      last_messages AS (
        SELECT DISTINCT ON (m.conversation_id)
          m.conversation_id,
          m.body AS last_body,
          m.created_at AS last_created_at,
          m.sender_user_id AS last_sender_user_id
        FROM messages m
        JOIN my_conversations mc ON mc.id = m.conversation_id
        ORDER BY m.conversation_id, m.created_at DESC
      )
      SELECT
        mc.id,
        mc.listing_id,
        mc.created_at,
        p.participant_user_ids,
        lm.last_body,
        lm.last_created_at,
        lm.last_sender_user_id
      FROM my_conversations mc
      JOIN participants p ON p.conversation_id = mc.id
      LEFT JOIN last_messages lm ON lm.conversation_id = mc.id
      ORDER BY lm.last_created_at DESC NULLS LAST, mc.created_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );

    return res.json({ conversations: result.rows, limit, offset });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getById = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.userId;

    const result = await pool.query(
      `SELECT m.id, m.conversation_id, m.sender_user_id, m.body, m.created_at, m.read_at
      FROM messages m
      JOIN conversation_participants cp ON cp.conversation_id = m.conversation_id
      WHERE m.id = $1 AND cp.user_id = $2`,
      [messageId, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Message introuvable" });
    }

    return res.json({ message: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.send = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.userId;
    const body = (req.body.body || "").trim();
    if (!body) return res.status(400).json({ message: "body requis" });

    const conversationId = (req.body.conversation_id || "").trim();
    const listingId = (req.body.listing_id || null) ?? null;
    const recipientUserId = (req.body.recipient_user_id || "").trim();

    await client.query("BEGIN");

    let finalConversationId = conversationId;

    if (finalConversationId) {
      const ok = await client.query(
        "SELECT 1 FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2",
        [finalConversationId, userId],
      );
      if (ok.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(403).json({ message: "Interdit" });
      }
    } else {
      if (!recipientUserId) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "recipient_user_id requis si pas de conversation_id" });
      }

      finalConversationId = randomUUID();
      await client.query(
        "INSERT INTO conversations (id, listing_id) VALUES ($1, $2)",
        [finalConversationId, listingId],
      );
      await client.query(
        "INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)",
        [finalConversationId, userId, recipientUserId],
      );
    }

    const messageId = randomUUID();
    const messageResult = await client.query(
      `INSERT INTO messages (id, conversation_id, sender_user_id, body)
      VALUES ($1, $2, $3, $4)
      RETURNING id, conversation_id, sender_user_id, body, created_at, read_at`,
      [messageId, finalConversationId, userId, body],
    );

    await client.query("COMMIT");
    return res.status(201).json({ message: messageResult.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ message: "Erreur serveur" });
  } finally {
    client.release();
  }
};

