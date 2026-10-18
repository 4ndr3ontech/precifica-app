const API_URL = "https://precifica-backend.andrel9meister.workers.dev";
let currentUser = { id: "user_teste_123", plan: "pro" }; // Simulação de utilizador logado

async function salvarCalculoNaNuvem(nomeModulo, dadosInput, dadosResultado) {
    try {
        const response = await fetch(`${API_URL}/api/calculations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id,
                moduleName: nomeModulo,
                inputs: dadosInput,
                results: dadosResultado
            })
        });
        
        const data = await response.json();
        if(data.success) {
            console.log("Cálculo guardado com sucesso na nuvem com ID:", data.id);
        }
    } catch (error) {
        console.error("Erro ao guardar na nuvem:", error);
    }
}