async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    if (!message) return;

    const chat = document.getElementById('chat');
    const userDiv = document.createElement('div');
    userDiv.className = 'bubble user';
    userDiv.innerText = message;
    chat.appendChild(userDiv);
    
    input.value = '';
    chat.scrollTop = chat.scrollHeight;

    try {
        // MUDADO DE LOCALHOST PARA NGROK PARA FUNCIONAR NA VERCEL
        const response = await fetch('http://localhost:5678/webhook/e55db928-05ed-4801-9e7a-1de17d978201', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario_msg: message })
        });

        const data = await response.json();
        const iaDiv = document.createElement('div');
        iaDiv.className = 'bubble ia';

        let textoFinal = "";
        if (Array.isArray(data) && data.length > 0) {
            textoFinal = data[0].output || data[0].resposta || JSON.stringify(data[0]);
        } else if (data.output) {
            textoFinal = data.output;
        } else if (data.resposta) {
            textoFinal = data.resposta;
        } else {
            textoFinal = typeof data === 'string' ? data : JSON.stringify(data);
        }

        textoFinal = textoFinal.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        iaDiv.innerText = textoFinal;
        chat.appendChild(iaDiv);
        
    } catch (error) {
        console.error("Erro:", error);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bubble ia';
        errorDiv.innerText = "Erro ao conectar com a IA. Verifique se o n8n e o ngrok estão rodando.";
        chat.appendChild(errorDiv);
    }
    
    chat.scrollTop = chat.scrollHeight;
}