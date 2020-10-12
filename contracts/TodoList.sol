pragma solidity >=0.5.16;

contract TodoList {
  // state variables
  uint public taskCount = 0; // NOTE: use public key word to read this state variable; soludity gives a fucntion that allows us to read

  // model for task
  struct Task {
      uint id; // unsigned integer
      string content;
      bool completed; // state of the checked box
  }

  // access storage
  mapping(uint => Task) public tasks; // storing key-value pair; id of the task

  // create event
  event TaskCreated(
      uint id,
      string content,
      bool completed
  );

  constructor() public {
      createTask("Check out maximo's new task");
  }

  // create task
  function createTask(string memory _content) public {
      taskCount ++; // update task count everytime a new task is created
      tasks[taskCount] = Task(taskCount, _content, false);
      emit TaskCreated(taskCount, _content, false);
  }
}

  