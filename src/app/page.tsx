import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <main className="flex flex-col items-center gap-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-center">
          Project Manager & Collaborative Code Editor
        </h1>
        <p className="text-lg text-center text-gray-700">
          Manage your projects, assign tasks, and collaborate on code with your
          team—all in one place.
        </p>
        <section className="bg-white rounded shadow p-6 w-full">
          <h2 className="text-xl font-semibold mb-2">
            Key Feature: File/Folder Access Control
          </h2>
          <ul className="list-disc list-inside text-gray-800 space-y-2">
            <li>Team leaders can assign tasks to team members.</li>
            <li>
              Each member gets access only to the files or folders relevant to
              their task.
            </li>
            <li>This prevents accidental changes to other parts of the project.</li>
            <li>
              Ensures smooth and error-free collaboration with GitHub integration.
            </li>
          </ul>
        </section>
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Start by planning your project and assigning tasks!</p>
        </div>
      </main>
    </div>
  );
}
