function displayautores(autores) {
    const tbody = document.getElementById("listaAutores");
    tbody.innerHTML = ""; // Limpar a tabela

    autores.forEach(Autor => {
        const row = tbody.insertRow();

        const tituloCell = row.insertCell(0);
        tituloCell.textContent = Autor.nome;

        const autorCell = row.insertCell(1);
        autorCell.textContent = Autor.biografia;

        const dataCell = row.insertCell(2);
        dataCell.textContent = new Date(Autor.dataNascimento).toLocaleDateString();

        const actionsCell = row.insertCell(3);
        actionsCell.innerHTML = `
        <button class="icon-btn_2" onclick='editarAutor(${JSON.stringify(Autor)})'>
            <i class="fas fa-edit"></i> 
        </button>

        <button class="icon-btn_2" onclick="deleteAutor(${Autor.id})">
            <i class="fas fa-trash"></i> 
        </button>`;
    });
}

function fetchAutores() {
    fetch("/api/autores")
        .then(res => res.json())
        .then(data => {
            displayautores(data);
        })
        .catch(error => {
            console.error("Erro ao buscar autores:", error);
        });
}

function deleteAutor(id) {
    fetch(`/api/autores/${id}`, {
        method: "DELETE"
    })
    .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        fetchAutores();
    })
    .catch(error => {
        console.error("Erro ao deletar Autor:", error);
    });
}

function editarAutor(Autor) {
    const addBookBtn = document.getElementById("addBookBtn");
    const nome= document.getElementById("nome");
    const biografia = document.getElementById("biografia");
    const dataNascimento = document.getElementById("dataNascimento");
    const AutorId= document.getElementById("AutorId");
    nome.value = Autor.nome;
    biografia.value = Autor.biografia;
    dataNascimento.value = new Date(Autor.dataNascimento).toISOString().split('T')[0];
    AutorId.value = Autor.id;
    addBookBtn.click();
/**/
}

function limparFormulario(){
    const nome= document.getElementById("nome");
    const biografia = document.getElementById("biografia");
    const dataNascimento = document.getElementById("dataNascimento");
    const AutorId= document.getElementById("AutorId");

    nome.value = "";
    biografia.value = "";
    dataNascimento.value = "";
    AutorId.value = "";
}

document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "/api/autores";
    const bookForm = document.getElementById("bookForm");
    const bookPopup = document.getElementById("bookPopup");
    const addBookBtn = document.getElementById("addBookBtn");
    const closePopupBtn = document.getElementById("closePopupBtn");

    // Carregar autores ao carregar a página
    fetchAutores()

    // Mostrar popup ao clicar no botão "Adicionar Autor"
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

    // Adicionar novo Autor ou atualizar um existente
    bookForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nome= document.getElementById("nome").value;
        const biografia = document.getElementById("biografia").value;
        const dataNascimento = document.getElementById("dataNascimento").value;
        const AutorId= document.getElementById("AutorId").value;

        let methodSalvar = "POST";
        let apiUrlSalvar = apiUrl;
        if(AutorId != "" && AutorId > 0){
            methodSalvar = "PUT";
            apiUrlSalvar += "/" + AutorId;
        }
    
        fetch(apiUrlSalvar, {
            method: methodSalvar,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, biografia, dataNascimento })
        })
        .then(res => {
            if (res.ok && res.status == "201") return res.json();
            else if (res.ok && res.status == "204") return;
            throw new Error(res.statusText);
        })
        .then(data => {
            fetchAutores();
            limparFormulario();
            closePopupBtn.click();
        })
        .catch(error => {
            console.error("Erro ao adicionar/atualizar Autor:", error);
        });
    
    });
});

