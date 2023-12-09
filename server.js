import { loadPackageDefinition, Server, ServerCredentials } from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'
const packageDef = loadSync('todo.proto', {})
const grpcObject = loadPackageDefinition(packageDef)
const todoPackage = grpcObject.todoPackage
const todos = []

function createTodo(call, callback) {
  const todoItem = {
    "id": todoPackage.length + 1,
    "text": call.request.text
  }
  todos.push(todoItem);
  callback(null, todoItem)
}

function readTodoStream(call) {
  todos.forEach(t => call.write(t))
  call.end()
}

function readTodo(call, callback) {
  callback(null, {"items": todos})
}


const server = new Server()
server.addService(todoPackage.Todo.service, {
  "createTodo": createTodo,
  "readTodos": readTodo,
  "readTodosStream": readTodoStream
})
server.bindAsync("0.0.0.0:4000", ServerCredentials.createInsecure(), () => {
  server.start()
  console.log("Server started on port 4000!")
})

