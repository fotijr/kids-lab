import CodeRunner from '../components/CodeRunner';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function Web() {

  return (
    <div>
      <h1>Web</h1>
      <p>
        The web is made up of 3 types of code: HTML, CSS, and JavaScript.
      </p>

      <h2>HTML</h2>
      <p>Hyper Text Markup Language (HTML) summary here.</p>
      <SyntaxHighlighter language="html" style={docco}>
        {`<h1>Title</h1>
<p>Paragraph text goes here.</p>`}
      </SyntaxHighlighter>


      <h2>CSS</h2>
      <p>Cascading Style Sheets (CSS) summary here.</p>
      <SyntaxHighlighter language="css" style={docco}>
        {`h1 {
  color: red;
}`}
      </SyntaxHighlighter>

      <h2>JavaScript</h2>
      <p>JavaScript(JS) summary here.</p>
      <SyntaxHighlighter language="javascript" style={docco}>
        {"const name = 'Lucy';\n" +
          "const age = 9;\n" +
          "const ageNextYear = 9 + 1;\n" +
          "const message = `Next year ${name} will be ${ageNextYear}!"}
      </SyntaxHighlighter>

      
      <h3>Try it out for yourself!</h3>
      <p>Type out some of the code you see in the examples (pick any line), or try to write your own code!</p>
      <SyntaxHighlighter language="javascript" style={docco}>
        {`1 + 1;
alert('This kid is cool 😎');
`}
      </SyntaxHighlighter>
      <CodeRunner />
    </div>
  )
};

export default Web;
