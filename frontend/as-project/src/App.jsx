import { Home } from 'lucide-react';

const App = () => {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl font-bold text-blue-500">
          Tailwind v3 Working <Home className="inline-block ml-2" />
        </h1>
      </div>
    </>
  );
};

export default App;