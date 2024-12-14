import express from 'express';
import { backupMessages, loadMessages, saveMessages } from '../utilities.js';

export default function localChat(app: express.Express) {
  app.post('/api/messages', async (req, res) => {
    const { message, username } = req.body as { message: string; username: string };
    if (
      message.length >= 10000 ||
      username.length >= 32 ||
      username.length < 1 ||
      message.length < 1
    ) {
      res.status(400);
      res
        .setHeader('Content-Type', 'application/json')
        .json({ success: false, message: 'Invalid form body' });
      return;
    }

    const messages = loadMessages();
    saveMessages(messages, { username, message, createdAt: Date.now(), id: Date.now().toString() });
    res.status(200);
    res.setHeader('Content-Type', 'application/json').json({ success: true });
  });

  app.post('/api/messages/send', async (req, res) => {
    const { message, username } = req.body as { message: string; username: string };
    if (
      message.length >= 10000 ||
      username.length >= 32 ||
      username.length <= 0 ||
      message.length <= 0
    ) {
      res.status(400);
      res
        .setHeader('Content-Type', 'application/json')
        .json({ success: false, message: 'Invalid form body' });
      return;
    }

    const messages = loadMessages();
    saveMessages(messages, { username, message, createdAt: Date.now(), id: Date.now().toString() });
    res.status(200);
    res.setHeader('Content-Type', 'application/json').json({ success: true });
  });
  app.get('/api/messages', async (req, res) => {
    const messages = loadMessages();
    const lastMessageId = req.query.lastMessageId;
    if (lastMessageId) {
      const index = messages.findIndex(m => m.id === lastMessageId);
      if (index === -1) {
        res.status(404);
        res.setHeader('Content-Type', 'application/json').json({ success: false });
        return;
      }
      const newMessages = messages.slice(index + 1);
      res.status(200);
      res
        .setHeader('Content-Type', 'application/json')
        .json({ success: true, messages: newMessages });
    } else {
      res.status(200);
      res.setHeader('Content-Type', 'application/json').json({ success: true, messages });
    }
  });

  function clearMessages(req: express.Request, res: express.Response) {
    const messages = loadMessages().length;
    backupMessages();
    saveMessages([]);
    res.status(200);
    res
      .setHeader('Content-Type', 'application/json')
      .json({ success: true, message: `Removed ${messages} messages.` });
  }

  ['reset', 'clear', 'removeAll'].forEach(command => {
    app.get(`/api/messages/${command}`, async (req, res) => {
      clearMessages(req, res);
    });
  });

  app.get('/api/messages/:id', async (req, res) => {
    const messages = loadMessages();
    const message = messages.find(m => m.id === req.params.id);
    if (!message) {
      res.status(404);
      res.setHeader('Content-Type', 'application/json').json({ success: false });
      return;
    }
    res.status(200);
    res.setHeader('Content-Type', 'application/json').json({ success: true, message });
  });

  app.get('/api/messages/last', async (req, res) => {
    const messages = loadMessages();
    if (messages.length === 0) {
      res.status(404);
      res
        .setHeader('Content-Type', 'application/json')
        .json({ success: false, message: 'No messages' });
      return;
    }
    res.status(200);
    res.setHeader('Content-Type', 'application/json').json({ success: true, message: messages[0] });
  });

  app.get('/api/messages/last/:count', async (req, res) => {
    const messages = loadMessages();
    if (messages.length === 0) {
      res.status(404);
      res
        .setHeader('Content-Type', 'application/json')
        .json({ success: false, message: 'No messages' });
      return;
    }
    const count = parseInt(req.params.count);
    if (count <= 0 || count > messages.length) {
      res.status(400);
      res
        .setHeader('Content-Type', 'application/json')
        .json({ success: false, message: 'Invalid count' });
      return;
    }
    res.status(200);
    res
      .setHeader('Content-Type', 'application/json')
      .json({ success: true, messages: messages.slice(-count) });
  });

  app.get('/api/messages/:id/delete', async (req, res) => {
    const messages = loadMessages();
    const message = messages.find(m => m.id === req.params.id);
    if (!message) {
      res.status(404);
      res.setHeader('Content-Type', 'application/json').json({ success: false });
      return;
    }
    messages.splice(messages.indexOf(message), 1);
    saveMessages(messages);
    res.status(200);
    res.setHeader('Content-Type', 'application/json').json({ success: true });
  });

  app.delete('/api/messages/:id', async (req, res) => {
    const messages = loadMessages();
    const message = messages.find(m => m.id === req.params.id);
    if (!message) {
      res.status(404);
      res.json({ success: false, message: 'Message not found' });
      return;
    }

    messages.splice(messages.indexOf(message), 1);
    saveMessages(messages);

    res.status(200);
    res.json({ success: true, message: 'Message deleted' });
  });

  app.get('/api/messages/:id/pin', async (req, res) => {
    const messages = loadMessages();
    const message = messages.find(m => m.id === req.params.id);
    if (!message) {
      res.status(404);
      res.setHeader('Content-Type', 'application/json').json({ success: false });
      return;
    }
    message.isPinned = !message.isPinned;
    saveMessages(messages);
    res.status(200);
    res.setHeader('Content-Type', 'application/json').json({ success: true });
  });

  app.get('/api/messages/pinned', async (req, res) => {
    const messages = loadMessages();
    res.status(200);
    res
      .setHeader('Content-Type', 'application/json')
      .json({ success: true, messages: messages.filter(m => m.isPinned) });
  });

  app.get('/api/messages/:id/edit', async (req, res) => {
    const messages = loadMessages();
    const message = messages.find(m => m.id === req.params.id);
    if (!message) {
      res.status(404);
      res.setHeader('Content-Type', 'application/json').json({ success: false });
      return;
    }
    if (!message.username === req.body.username) {
      res.status(400);
      res
        .setHeader('Content-Type', 'application/json')
        .json({ success: false, message: 'Unauthorized' });
      return;
    }
    res.status(200);
    res.setHeader('Content-Type', 'application/json').json({ success: true, message });
  });

  app.get('/api/messages/users/:username', async (req, res) => {
    const messages = loadMessages();
    res.status(200);
    res.setHeader('Content-Type', 'application/json').json({
      success: true,
      messages: messages.filter(m => m.username === req.params.username),
    });
  });

  app.get('/api/messages/bulkdelete/:username', async (req, res) => {
    const messages = loadMessages();
    const messagesToDelete = messages.filter(m => m.username === req.params.username);
    saveMessages(messages.splice(messages.indexOf(messagesToDelete[0]), messagesToDelete.length));
    res.status(200);
    res.setHeader('Content-Type', 'application/json').json({ success: true });
  });
}
