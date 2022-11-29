const Header = (props) => {
  return (
    <>
     <h1> {props.course} </h1>
    </>
  )
}

const Part = (props) => {
  return (
    <div>
      <p>
        {props.name} {props.tasks}
      </p>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part name={props.name1} tasks={props.ex1} />
      <Part name={props.name2} tasks={props.ex2} />
      <Part name={props.name3} tasks={props.ex3} />
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      <p>
        Number of exercises: {props.ex1 + props.ex2 + props.ex3}
      </p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content name1={part1} name2={part2} name3={part3} ex1={exercises1} ex2={exercises2} ex3={exercises3} />
      <Total ex1={exercises1} ex2={exercises2} ex3={exercises3} />
    </div>
  )
}

export default App