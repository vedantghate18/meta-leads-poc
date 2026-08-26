const WS_URL = 'ws://10.0.2.2:3000';

let socket = null;

export const connectWebSocket = onLead => {
  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log('✅ WebSocket connected');
  };

  socket.onmessage = event => {
    try {
      const lead = JSON.parse(event.data);

      console.log('🔥 New lead received:', lead);

      onLead(lead);
    } catch (error) {
      console.error('❌ Invalid WebSocket data:', error);
    }
  };

  socket.onerror = error => {
    console.error('❌ WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('🔌 WebSocket disconnected');
  };

  return socket;
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};
