import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function Server() {
  return (
    <div>
      <h1>Server</h1>
      <p>"Server" can sound pretty technical, but it just means "another computer"! When we write server code, it's code we know will run somewhere else.
        Often times servers are used for complicated processing, then return results to other computers.</p>

      <p>Any programming language can run on a server.
        The examples below are C# (pronounced "see sharp"), but other popular languages include Python, Go, Ruby, and JavaScript.
      </p>

      <h2>Examples</h2>
      <SyntaxHighlighter language="c#" style={docco}>
        {`
function void TakeAttendance(Student[] students) {
  foreach (var student in students)
  {
    Console.WriteLine($"{student.Name} is here.");
  }
}

var expectedStudents = 4;

var students = new[] {
  new Student("Meilin"),
  new Student("Miriam")
  new Student("Priya"),
  new Student("Abby")
};

TakeAttendance(students);

if (students.Count == expectedStudents) {
  // everyone is here 😃 🍕
  ThrowPizzaParty();
}
`}
      </SyntaxHighlighter>
    </div>
  )
}

export default Server
