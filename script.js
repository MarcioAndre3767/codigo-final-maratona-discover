const Modal = {
    open() {
        //Abrir modal
        //Adicionar a class active ao modal

        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')              
    },
    close() {
        //fechar o modal
        //remover o class active do modal

        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')        
    }
  }


const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) 
        || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify( 
        transactions))
    }
}


const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)
        
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1) 

        App.reload()        
    },

    incomes() {
        let income = 0;        
        //pegar todas as transações
        Transaction.all.forEach( transaction => {            
            //para cada transacao, se ela for maior que zero
            if( transaction.amount > 0 ) {                
                //somar a uma variavel e retornar a variavel
                income += transaction.amount;                            }  
        })  

          return income;
    },

    expenses() {
        let expense = 0;

        Transaction.all.forEach( transaction => {
            if ( transaction.amount < 0 ) {
                expense += transaction.amount
            }
        })

        return expense
    },

    total() {
          return Transaction.incomes() + Transaction.expenses();
    }
}


const DOM = {
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransction(transaction, index)
        tr.dataset.index = index

        DOM.transactionContainer.appendChild(tr)
    },

    innerHTMLTransction(transaction, index ){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formtCurrency(transaction.amount)
        
        const html = `        
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
        </td>        
        `
        return html
    },
    
    updateBalance() {
        document
            .getElementById( 'incomeDisplay' )
            .innerHTML = Utils.formtCurrency( Transaction.incomes() )
        document
            .getElementById( 'expenseDisplay' )
            .innerHTML = Utils.formtCurrency( Transaction.expenses() )
        document
            .getElementById( 'totalDisplay' )
            .innerHTML = Utils.formtCurrency( Transaction.total() )
    },

    clearTransactions() {
        DOM.transactionContainer.innerHTML = " "        
    }
}


const Utils = {
    formatAmount(value) {
        value = Number(value) * 100

        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`

    },

    formtCurrency(value) {
        const signal = Number(value) < 0 ? "-" : " "

        value = String(value).replace(/\D/g, "") //expressão regular

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
          
        return signal + value
    }
}


const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    }, 

    validateFields() {
        const { description, amount, date } = Form.getValues()        
        
        if( description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === "" ) {
                throw new Error("Por favor, prencha todos os campos.")
                
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues() 
        
        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }        
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },


    submit(event) {
        event.preventDefault()

        try {
            // verificar se todas as informações foram preenchidas
            Form.validateFields()

            // formatar os dados para salva 
            const transaction = Form.formatValues()  

            //salvar
            Transaction.add(transaction)

            // apagar os dados do formulario
            Form.clearFields()

            //modal fechar
            Modal.close() 

        } catch (error) {
            alert(error.message)
        }        
    }
}


const App = {
    init() {
        Transaction.all.forEach( DOM.addTransaction )
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}


App.init()






// [
//     {    
//     description: 'Luz',
//     amount: -50001,  //-500,00
//     date: '23/01/2021',
//     },
//     {
//     description: 'Criação website',
//     amount: 500000,  //500000
//     date: '23/01/2021',
//     },
//     {
//     description: 'Internet',
//     amount: -200012,  //-1.500,00
//     date: '23/01/2021',
//     },
//     {
//         id: 4,
//         description: 'App',
//         amount: 200000,  //2.500,00
//         date: '23/01/2021',
//         }
// ]





































