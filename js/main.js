class Budget {
    constructor() {
        this.budgetAlert = document.querySelector("#budgetAlert")
        this.budgetInput = document.querySelector("#budgetInput")
        this.expenseForm = document.querySelector("#expenseForm")
        this.expenseInput = document.querySelector("#expenseInput")
        this.expenseAmountInput = document.querySelector("#expenseAmountInput")
        this.budgetForm = document.querySelector("#budgetForm")
        this.expenseAlert = document.querySelector("#expenseAlert")
        this.budgetAmount = document.querySelector("#budgetAmount")
        this.expenseAmount = document.querySelector("#expenseAmount")
        this.balanceAmount = document.querySelector("#balanceAmount")
        this.expenseList = document.querySelector("#expenseList")
        this.balance = document.querySelector(".balance");
        this.balanceNumber = 0
        this.budgetNumber = 0
        this.expenseNumber = 0

        this.itemList = []
        if (localStorage.getItem('itemList') != null) {
            this.itemList = JSON.parse(localStorage.getItem('itemList'));
            this.addExpense(this.itemList);
        }
      
        this.itemID = 0;
    }
    SubmitBudgetForm() {
        const value = this.budgetInput.value;

        
        console.log(value);
        if (value < 0 || value === "") {
            this.budgetAlert.classList.replace("d-none", "d-block");
            setTimeout(() => {
                this.budgetAlert.classList.replace("d-block", "d-none")
            }, 1500);

        }
        else {
            this.budgetAmount.textContent = value;
            this.budgetInput.value = "";
            this.showBalance();
        }

    }
    showBalance() {
        const expense = this.totalExpense();
        const total = parseInt(this.budgetAmount.textContent) - expense;
        this.balanceAmount.textContent = total;

        if (total === 0) {

            this.balance.classList.remove("text-success", "text-danger")
            this.balance.classList.add("text-dark")
        }
        else if (total < 0) {
            this.balance.classList.remove("text-success", "text-dark")
            this.balance.classList.add("text-danger")
        }
        else {

            this.balance.classList.add("text-success")
            this.balance.classList.remove("text-danger", "text-dark")
        }
    }
    totalExpense() {

        let total = 0;
        if (this.itemList.length > 0) {

            total = this.itemList.reduce((acc, curr) => {
                acc += curr.amount;
                return acc
            }, 0)
        }
        this.expenseAmount.textContent = total;

        return total;

    }
    submitExpenseForm() {
        const expenseValue = this.expenseInput.value;
        const amountValue = this.expenseAmountInput.value;
        if (amountValue < 0 || expenseValue === "") {
            this.expenseAlert.classList.replace("d-none", "d-block");
            setTimeout(() => {
                this.expenseAlert.classList.replace("d-block", "d-none")
            }, 1500);

        }
        else {
            let amount = parseInt(amountValue)
            this.expenseAmountInput.value = "";
            this.expenseInput.value = "";
            let expense = {
                id: this.itemID,
                title: expenseValue,
                amount
            }
            this.itemID++;
            this.itemList.push(expense);
            this.addExpense(this.itemList);
            localStorage.setItem("itemList", JSON.stringify(this.itemList));

            this.showBalance()
        }
    }
    addExpense(expenses) {
        let item = ``;
        for (const expense of expenses) {
            item += `

<tr>
                            <td class="text-danger title fs-3 text-uppercase">- ${expense.title}</td>
                            <td class="text-danger title fs-3">${expense.amount}</td>
                            <td >
<i data-id="${expense.id}" class="fas fa-edit icon-edit"></i>
                            </td>
                            <td >

                            <i data-id="${expense.id}" class="fas fa-trash icon-delete"></i>
                        </td>
                        </tr>

`
        }
        this.expenseList.innerHTML = item
    }
    deleteExpense(item) {
        let id = parseInt(item.dataset.id)
        this.itemList.splice(id, 1)
        let parent = item.parentElement.parentElement;
        this.expenseList.removeChild(parent)
        this.showBalance()

    }
    editExpense(item) {
        let id = parseInt(item.dataset.id)
        let parent = item.parentElement.parentElement;
        this.expenseInput.value = this.itemList[id].title
        this.expenseAmountInput.value = this.itemList[id].amount
        this.expenseList.removeChild(parent)
        this.itemList.splice(id, 1)
        this.showBalance()
    }
}

const eventListener = () => {
    const expenseForm = document.querySelector("#expenseForm");
    const budgetForm = document.querySelector("#budgetForm");
    const expenseList = document.querySelector("#expenseList");
    const app = new Budget();
    budgetForm.addEventListener("submit", function (e) {
        e.preventDefault();
        app.SubmitBudgetForm()

    })
    expenseForm.addEventListener("submit", function (e) {
        e.preventDefault()
        app.submitExpenseForm()

    })
    expenseList.addEventListener("click", function (e) {
        e.preventDefault()
        if (e.target.classList.contains("icon-edit")) {
            app.editExpense(e.target)
        }
        else if (e.target.classList.contains("icon-delete")) {
            app.deleteExpense(e.target)

        }
    })
}
document.addEventListener("DOMContentLoaded", function (e) {

    eventListener()
})