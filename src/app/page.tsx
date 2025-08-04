// import { prisma } from "../lib/prisma";

// export default async function Home() {
//   const tasks = await prisma.task.findMany();

//   return (
//     <>
//       <h1>Tasks</h1>
//       <ul>
//         {tasks.map((task) => (
//           <li key={task.id}>{task.title}</li>
//         ))}
//       </ul>
//     </>
//   );
// }
import { TodoApp } from '@/components/TodoApp';

const Home = () => {
  return <TodoApp />;
};

export default Home;