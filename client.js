import { loadPackageDefinition, credentials } from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'
const packageDef = loadSync('todo.proto', {})
const grpcObject = loadPackageDefinition(packageDef)
const todoPackage = grpcObject.todoPackage

const text = process.argv[2]
console.log("text", text)

const client = new todoPackage.Todo("localhost:4000", credentials.createInsecure())

client.createTodo({
  "id": -1,
  "text": text,
}, (err, response) => {
  if (err) {
    console.log("There was an error: ", err)
  } else {
    console.log("Recieved from server " + JSON.stringify(response)) 
  }
})
client.readTodos(null, (err, results) => {results.items.forEach(item => console.log(item.text)) });
const call = client.readTodosStream();
call.on("data", item => console.log("Recived item stream from server " + JSON.stringify(item)))

call.on("end", () => {console.log("Stream is completed!")})
// call.on("error", (e) => {console.log("There is an error: ", e)})
// call.on("status", (status) => {console.log("Here is the status: ", status)})