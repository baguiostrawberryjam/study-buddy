import FormChat from "./components/forms/FormChat";
import Default from "./templates/Default";

export default function Home() {
  return (
    <Default className="flex items-center justify-center">

      <div>
        <div className="max-w-md w-full mx-auto text-center">

          {/** Welcome Message */}
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl">ChatGPT</h1>
            <p>
              Welcome to Study Buddy! {` `}
              <a className="underline" href="/signup">
                Create your free account
              </a>{` `}
              and upload your notes to get instant AI-powered study help.
            </p>
          </div>

          {/** Chat Body */}
          <div className="py-10">

          </div>

          {/** Chat Form */}
          <div className="">
            <FormChat />
          </div>

        </div>
      </div>

    </Default>
  );
}
