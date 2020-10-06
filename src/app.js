App = {
    loading: false,

    contracts: {},

    load: async () => {
        // Load app..
        await App.loadWeb3() // load the web view to connect to the blockchain
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

    // NOTE: use metamask library to talk to the ethereum blockchain
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider
            web3 = new Web3(web3.currentProvider)
        } else {
            web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
        }
        
        if (window.ethereum) {
            web3 = new Web3((window.ethereum));
            window.web3 = new Web3(ethereum);
            try {
                await ethereum.enable();
            } catch (error) {
                console.error(error);
            }
        }
    },

    loadAccount: async () => {
        window.ethereum.enable().then((accounts) => {
            App.account = accounts[0]
        })
    }, 

    loadContract: async () => {
        // NOTE: creating a JavaScript version of the smart contract
        const todoList = await $.getJSON('TodoList.json')
        App.contracts.TodoList = TruffleContract(todoList) // create wrapper around the contract by truffle
        App.contracts.TodoList.setProvider(App.web3Provider)

        App.todoList = await App.contracts.TodoList.deployed()
    },
 
    render: async () => {
        // Prevent double render
        if (App.loading) {
            return
        }

        // Update app loading state
        App.setLoading(true)

        // Render Account
        $('#account').html(App.account)

        await App.renderTasks()

        // Update loading state
        App.setLoading(false)
    },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')

        if (boolean) {
            loader.show()
            content.hide()
        } else {
            loader.hide()
            content.show()
        }
    },

    renderTasks: async () => {
        // load the tasks form the blockchain
        const taskCount = await App.todoList.taskCount()
        const $taskTemplate = $('.taskTemplate')

        // Render out each task with a new task template
        for (var i = 1; i <= taskCount; i++) {
            // Fetch the task data from a new task blockchain
            const task = await App.todoList.tasks(i) // return an array of tasks
            const taskId = task[0].toNumber()
            const taskContent = task[1]
            const taskCompleted = task[2]

            // create the html for the task
            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskContent)
            $newTaskTemplate.find('input')
                            .prop('name', taskId)
                            .prop('checked', taskCompleted)
                            // .on('click', App.toggleCompleted)

            if (taskCompleted) {
                $('#completedTaskList').append($newTaskTemplate)
            } else {
                $('#taskList').append($newTaskTemplate)
            }
            // Show the task
            $newTaskTemplate.show()
        }
    }
}

$(() => {
    $(window).load(() => {
        App.load()
    })
})