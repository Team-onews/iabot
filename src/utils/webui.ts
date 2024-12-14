import express from 'express';
import { client } from '../main.js';
// import send from './webui/sendMessage.js';
import { getChannel } from './get.js';
import localChat from './webui/local-chat.js';
import { i14a } from '../configs/i14a.js';

export default async function startWebUIServer() {
  const staticDir = './public';
  const port = i14a.webui.port;

  const server = express();

  server.listen(port, () => {
    client.log('WebUI server running on port 8080');
  });

  server.use(express.json());

  server.get('/restart', async (req, res) => {
    res.status(200);
    res.setHeader('Content-Type', 'application/json').json({ success: true });
    await client.stop();
  });

  server.post('/api/sendMessage', async (req, res) => {
    try {
      // send(req, res);

      const { channel_id, message } = req.body;
      console.log(channel_id, message);
      if (/a-Zぁ-ン/.test(channel_id)) {
        res.status(400);
        res.setHeader('Content-Type', 'application/json').json({
          status: 'Bad Request',
          success: false,
          message: 'Channel ID must be numeric',
        });
        return;
      }
      const channel = await getChannel(channel_id);
      if (!channel) {
        res.status(404);
        res
          .setHeader('Content-Type', 'application/json')
          .json({ status: 'Not found', success: false, message: 'Channel not found' });
        return;
      }
      if (!channel.isSendable()) {
        res.status(403);
        res
          .setHeader('Content-Type', 'application/json')
          .json({ status: 'Forbidden', success: false, message: 'Channel is read-only' });
        return;
      }

      await channel.send(message);
      res.setHeader('Content-Type', 'application/json').json({ success: true });
    } catch (e) {
      console.error(e);
    }
  });

  localChat(server);

  server.use(express.static(staticDir, { extensions: ['html', 'htm'] }));

  return { port, server, staticDir };
}
