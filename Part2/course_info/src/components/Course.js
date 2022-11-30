const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ sum }) => <h3>Number of exercises {sum}</h3>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => 
  <>
    {parts.map(p => <Part part={p} key={p.id}/>)}    
  </>

const Course = ({course}) => {
  const courseSummer = (prev, x) => prev + x.exercises
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total sum={course.parts.reduce(courseSummer, 0)} />
    </div>
  )
}

export default Course