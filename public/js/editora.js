function displayeditoras(editoras) {
    const tbody = document.getElementById("listaEditoras");
    tbody.innerHTML = ""; // Limpar a tabela

    editoras.forEach(editora => {
        const row = tbody.insertRow();

        const tituloCell = row.insertCell(0);
        tituloCell.textContent = editora.nome;

        const autorCell = row.insertCell(1);
        autorCell.textContent = editora.endereco;

        const dataCell = row.insertCell(2);
        dataCell.textContent = editora.telefone;

        const actionsCell = row.insertCell(3);
        actionsCell.innerHTML = `
        <button class="icon-btn_2" onclick='editareditora(${JSON.stringify(editora)})'>
            <i class="fas fa-edit"></i> 
        </button>

        <button class="icon-btn_2" onclick="deleteeditora(${editora.id})">
            <i class="fas fa-trash"></i> 
        </button>`;
    });
}

function fetcheditoras() {
    fetch("/api/editoras")
        .then(res => res.json())
        .then(data => {
            displayeditoras(data);
        })
        .catch(error => {
            console.error("Erro ao buscar editoras:", error);
        });
}

function deleteeditora(id) {
    fetch(`/api/editoras/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        fetcheditoras();
    })
    .catch(error => {
        console.error("Erro ao deletar editora:", error);
    });
}

function editareditora(editora) {
    const addBookBtn = document.getElementById("addBookBtn");
    const nome = document.getElementById("nome");
    const telefone = document.getElementById("telefone");
    const endereco= document.getElementById("endereco");
    const editoraId= document.getElementById("id_editora");
    nome.value = editora.nome;
    telefone.value = editora.telefone;
    endereco.value = editora.endereco
    editoraId.value = editora.id;
    addBookBtn.click();
/**/
}

function limparFormulario(){
    const nome = document.getElementById("nome");
    const telefone = document.getElementById("telefone");
    const endereco = document.getElementById("endereco");
    const editoraId= document.getElementById("id_editora");

    nome.value = "";
    telefone.value = "";
    endereco.value = "";
    editoraId.value = "";
}

document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "/api/editoras";
    const bookForm = document.getElementById("bookForm");
    const bookPopup = document.getElementById("bookPopup");
    const addBookBtn = document.getElementById("addBookBtn");
    const closePopupBtn = document.getElementById("closePopupBtn");

    // Carregar editoras ao carregar a página
    fetcheditoras()

    // Mostrar popup ao clicar no botão "Adicionar editora"
    addBookBtn.addEventListener("click", function() {
        bookPopup.classList.add("show");
        bookPopup.classList.remove("hidden");
    });

    // Fechar popup
    closePopupBtn.addEventListener("click", function() {
        bookPopup.classList.add("hidden");
        bookPopup.classList.remove("show");
        limparFormulario();
    });

    // Adicionar novo editora ou atualizar um existente
    bookForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const telefone = document.getElementById("telefone").value;
        const endereco = document.getElementById("endereco").value;
        const editoraId= document.getElementById("id_editora").value;

        let methodSalvar = "POST";
        let apiUrlSalvar = apiUrl;
        if(editoraId != "" && editoraId > 0){
            methodSalvar = "PUT";
            apiUrlSalvar += "/" + editoraId;
        }
    
        fetch(apiUrlSalvar, {
            method: methodSalvar,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, telefone, endereco })
        })
        .then(res => {
            if (res.ok && res.status == "201") return res.json();
            else if (res.ok && res.status == "204") return;
            throw new Error(res.statusText);
        })
        .then(data => {
            fetcheditoras();
            limparFormulario();
            closePopupBtn.click();
        })
        .catch(error => {
            console.error("Erro ao adicionar/atualizar editora:", error);
        });
    
    });
});
