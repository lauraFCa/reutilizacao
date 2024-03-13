const PORT = 3000;

// Simulação de uma base de dados de usuários
let users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
];

// Função para analisar as requisições HTTP
function handleRequest(request) {
    const [method, url] = request.split(' ');

    if (method === 'GET' && url === '/') {
        return { status: 200, body: '<h1>Página inicial</h1>' };
    }
    else if (method === 'GET' && url === '/users') {
        return { status: 200, body: JSON.stringify(users) };
    }
    else if (method === 'GET' && url.match(/^\/users\/\d+$/)) {
        const userId = parseInt(url.split('/')[2]);
        const user = users.find(user => user.id === userId);
        if (user) {
            return { status: 200, body: JSON.stringify(user) };
        } else {
            return { status: 404, body: JSON.stringify({ error: 'Usuário não encontrado' }) };
        }
    } else if (method === 'POST' && url === '/users') {
        return { status: 201, body: '<h1>Usuário criado com sucesso</h1>' };
    } else if (method === 'PUT' && url.match(/^\/users\/\d+$/)) {
        const userId = parseInt(url.split('/')[2]);
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            users[userIndex] = { id: userId, name: 'Novo Nome' };
            return { status: 200, body: '<h1>Usuário atualizado com sucesso</h1>' };
        } else {
            return { status: 404, body: JSON.stringify({ error: 'Usuário não encontrado' }) };
        }
    } else if (method === 'DELETE' && url.match(/^\/users\/\d+$/)) {
        const userId = parseInt(url.split('/')[2]);
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            return { status: 200, body: '<h1>Usuário deletado com sucesso</h1>' };
        } else {
            return { status: 404, body: JSON.stringify({ error: 'Usuário não encontrado' }) };
        }
    } else {
        return { status: 404, body: '<h1>Rota não encontrada</h1>' };
    }
}


function startServer() {
    const server = new WebSocketServer({ port: PORT });

    server.on('connection', function connection(socket) {
        socket.on('message', function incoming(message) {
            const request = message.toString();
            const response = handleRequest(request);
            socket.send(`HTTP/1.1 ${response.status}\r\nContent-Type: text/html\r\n\r\n${response.body}`);
        });
    });

    console.log(`Servidor iniciado na porta ${PORT}`);
}

startServer();
