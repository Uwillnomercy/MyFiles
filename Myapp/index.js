//Add modules into todo application
const program = require('commander');
const { prompt } = require('inquirer');
const fs = require('fs');
const path = require('path');
const util = require('util');

program
  .version('1.0.0')
  .description('TODO application');

const STORAGE_PATH = path.resolve('./store.json');
const ACCOUNT_ID = 1;
const { O_APPEND, O_RDONLY, O_CREAT } = fs.constants;
const TODO_NOT_FOUND = `Todo item not found`;

// converts callback based functions of 'fs' module to a Promise-based
const fsOpen = util.promisify(fs.open);
const fsReadFile = util.promisify(fs.readFile);
const fsWriteFile = util.promisify(fs.writeFile);

//Read the entire content of file
function getAllTodos() {
  return fsReadFile(STORAGE_PATH, { encoding: 'utf8', flag: O_RDONLY | O_CREAT })
    .then((data) => {
      let jsonText = data;
      if (!jsonText) jsonText = '{}';
      return JSON.parse(jsonText);
    })
    .then((storage) => {
    return storage.todos || [];
  })
}
//file open and saving todo items into the storage
function saveAllTodos(todos) {
  return fsOpen(STORAGE_PATH, O_APPEND | O_CREAT)
    .then(() => {
      fsWriteFile(STORAGE_PATH, JSON.stringify({ todos }))
    });
}
//find index of TODO item by it's id in array
function findTodoIndex(id, todos) {
  return todos.findIndex((todo) => todo.id === id)
}
//function to create unique ID for todo element
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
//represents information into console
function inform(...args) {
  console.info(...args);
}
//creates todo elements and return actual information about todo elements
function createTodo(data) {
  const now = new Date();
  return {
    comment: null,
    createdDate: now,
    createdByUserId: ACCOUNT_ID,
    id: guid(),
    isLiked:false,
    lastUpdateDate: now,
    lastUpdateByUserId: ACCOUNT_ID,
    ...data,
  };
}
//add todo element to storage
function addTodo(todo, todos) {
  return [...todos, todo];
}
//updates todo information about todo element
function updateTodo(id, change, todos) {
  const index = findTodoIndex(id, todos);
  if (index === -1) throw e
  const currentTodo = todos[index];
  const updatedTodo = {
    ...currentTodo,
    ...change,
    lastUpdateDate: new Date(),
    lastUpdateByUserId: ACCOUNT_ID,
    createdDate: currentTodo.createdDate,
    createdByUserId: currentTodo.createdByUserId,
  };
  const result = [...todos];
  result.splice(index, 1, updatedTodo);
  return result;
}
//removing todo element from the storage
function removeTodoItem(id) {
  return getAllTodos()
    .then((todos) => {
      const index = findTodoIndex(id, todos);
      if (index === -1) throw e;
      const result = [...todos];
      const removedItems = result.splice(index, 1);
      return saveAllTodos(result).then(() => removedItems.length);
    });
}
//reading information about todo element
function readTodo(id) {
  return getAllTodos()
  .then((todos) => {
  const index = findTodoIndex(id, todos);
  if (index === -1) throw e;
  return todos[index];
});
}

const createQuestions = [
  {
    type : 'input',
    name : 'title',
    message : 'Enter title ...'
  },
  {
    type : 'input',
    name : 'description',
    message : 'Enter description ...'
  },
];

const updateQuestions = [
  {
    type : 'input',
    name : 'title',
    message : 'Enter new title ...'
  },
  {
    type : 'input',
    name : 'description',
    message : 'Enter new description ...'
  },
];

const commentQuestions = [
  {
    type : 'input',
    name : 'comment',
    message : 'Enter comment ...'
  },
];
//command to create new todo items
program
  .command('create')
  .description('Create new TODO item')
  .action(() => {
    let receivedAnswers;
    prompt(createQuestions)
      .then((answers) => {
        receivedAnswers = answers;
        return getAllTodos();
      })
      .then((todos) => {
        const todo = createTodo({
          title: receivedAnswers.title,
          description: receivedAnswers.description,
        });
        const updatedTodos = addTodo(todo, todos);
        return saveAllTodos(updatedTodos).then(() => todo.id);
      })
      .then(inform)
      .catch((error) => {
        throw error;
      });
  });
//updating information about todo items
program
  .command('update <id>')
  .description('Update TODO item')
  .action((id) => {
    let newAnswers;
    prompt(updateQuestions)
      .then((answers) => {
        newAnswers = answers;
        return getAllTodos();
      })
      .then((todos) => {
        const result = updateTodo(id, {
          title: newAnswers.title,
          description: newAnswers.description,
        }, todos);
        return saveAllTodos(result).then(() => id);
      })
      .then(inform)
      .catch((e) => {
        console.info(TODO_NOT_FOUND);
      });
  });
//command that removes todo items from the storage and shows it's ID to console
program
  .command('remove <id>')
  .alias('rm')
  .description('Remove TODO item by id')
  .action((id) => {
    removeTodoItem(id)
      .then(inform)
      .catch((e) => {
        console.info(TODO_NOT_FOUND);
      });
  });
//shows all todo items from the storage
program
  .command('list')
  .description('List all TODOs')
  .action(() => {
    getAllTodos().then(inform)
  });
// read the information about Todo item and represents it to console in Json format
program
  .command('read <id>')
  .description('Read the actual TODO item by id')
  .action((id) => {
    readTodo(id)
    .then(inform)
    .catch ((e) => {
      console.info(TODO_NOT_FOUND);
    });
  });
// command to mark todo item as liked;
program
  .command('like <id>')
  .description('Like TODO item')
  .action((id) => {
    getAllTodos()
      .then((todos) => {
        const result = updateTodo(id, { isLiked: true }, todos);
        return saveAllTodos(result).then(() => result[findTodoIndex(id, result)]);
      })
        .then((todo) => {
         inform(todo.id);
         inform (`isLiked:  ${todo.isLiked}`);
        })
        .catch((e) => {
        console.info(TODO_NOT_FOUND);
      });
  });
  // command to mark todo item as unliked;
  program
    .command('unlike <id>')
    .description('Unlike TODO item')
    .action((id) => {
      getAllTodos()
        .then((todos) => {
          const result = updateTodo(id, { isLiked: false }, todos);
          return saveAllTodos(result).then(() => result[findTodoIndex(id, result)]);
        })
          .then((todo)=>{
           inform(todo.id);
           inform (`isLiked: ${todo.isLiked}`);
         })
        .catch((e) => {
          console.info(TODO_NOT_FOUND);
        });
    });
//gives oportunity to comment todo item by it's ID
program
  .command('comment <id>')
  .description('Comment TODO item')
  .action((id) => {
    let receivedAnswers;
    prompt(commentQuestions)
      .then((answers) => {
        receivedAnswers = answers;
        return getAllTodos();
      })
      .then((todos) => {
        const result = updateTodo(id, { comment: receivedAnswers.comment }, todos);
        return saveAllTodos(result).then(() => id);
      })
      .then(inform)
      .catch((e) => {
      console.info(TODO_NOT_FOUND);
      });
  });

program.parse(process.argv);
