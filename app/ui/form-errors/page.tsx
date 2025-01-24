import FormHoles from "./components/form-holes";
import FormWithStatus from "./components/form-with-status";
import FormWithTooltip from "./components/form-tooltip";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
/*
import FormAnimatedExample from "./components/from-animated";
import FormAsyncExample from "./components/form-async";
import FormWithLabel from "./components/form-labels";
*/

export const metadata: Metadata = {
  title: "Handling Form Errors",
  description: "How to deal with different kind of form errors in UI",
};


export default function Page() {
  return (
    <main>
      <article className="mb-32 flex flex-col space-y-20">
        <section className="flex flex-col space-y-8 text-secondary-foreground leading-relaxed">
          <h1 className="font-medium capitalize">Handling Form Errors</h1>
          <p>
            Forms are one of the most complex things to design, and one of the
            most challenging aspects is handling errors.
          </p>
          <p>
            When something goes wrong, we need to clearly indicate what the
            issue is and how the user can fix it — or offer support if they
            cannot. Good error handling gives users a sense of control and
            builds trust, while poor error handling breaks trust and fuels
            frustration.
          </p>
        </section>

        <section className="flex flex-col space-y-8 text-secondary-foreground leading-relaxed">
          <h4 className="font-medium text-foreground capitalize">
            Good errors handling
          </h4>
          <p>
            Good errors address two things:
            <ul className="list-decimal list-inside mt-6">
              <li>Where did the error happen?</li>
              <li>What caused the error, and how can the user fix it?</li>
            </ul>
          </p>
          <p className="text-sm border-l-2 border-secondary-foreground pl-3 max-w-[480] text-secondary-foreground">
            Also, as all good UI, it should maintains no delay or minimal one
            between action and feedback, and preserves users{"'"} data between
            actions.
          </p>
        </section>
        {/* VALIDATION ERRORS */}
        <section className="flex flex-col space-y-8 text-secondary-foreground mb-20 leading-relaxed">
          <h4 className="font-medium text-foreground capitalize">
            The Validation Errors
          </h4>
          <p>
            Most of the form errors are{" "}
            <span className="font-medium">Validation Errors</span> that occur in
            some of the input fields. Traditionally they are placed directly
            above or below the field.
          </p>
          <div className="w-[calc(100%+1.25rem)] flex flex-col space-y-4">
            <div className="w-full bg-card border-border/50 border rounded -translate-x-2.5 relative">
              <FormHoles />
            </div>
            <p className="text-muted-foreground text-sm mx-auto">Traditional error message placement creates an ugly layout.</p>
          </div>
          <p>
            Unfortunately, this leads to either jumpy behavior or ugly holes in
            the layout if we try to reserve space for messages. Plus, this
            approach leaves us with very little space for potentially long
            messages and allows messages to stick to the wrong field.
          </p>
          <p>
            Instead of placing messages near the field, we could separate the
            field status (e.g., valid or not) from the message itself by placing
            the status indicator inside the input and adding a tooltip.
          </p>
          <div className="w-[calc(100%+1.25rem)] flex flex-col space-y-4">
            <div className="w-full bg-card border-border/50 border rounded -translate-x-2.5 relative">
              <FormWithTooltip />
            </div>
            <p className="text-muted-foreground text-sm mx-auto">
              Inline field statuses and tooltips are easier to understand and more flexible.
              </p>
          </div>
          <p>
            This way, it{"'"}s easy to graps whether a field is valid or not,
            and we can provide not only error messages, but different tips to
            help users understand what kind of data we need.
          </p>
        </section>
        {/* ASYNC */}
        {/* 
        <section className="flex flex-col space-y-8  text-secondary-foreground mb-16 leading-relaxed">
          <h4 className="font-medium capitalize text-foreground">
            Dealing with Async
          </h4>
          <p>
            If validation or processing happens asyn, it{"'"}s often better then
            not to indicate it.
          </p>
          <div className="w-[calc(100%+1.25rem)] flex flex-col space-y-4">
            <div className="w-full bg-card border-border/50 border rounded -translate-x-2.5 relative">
              <FormAsyncExample/>
            </div>
          </div>
          <p>
            Note that async validation does not start immediately with each
            keystroke but is debounced until the user finishes inputting the
            data.
          </p>
        </section>
        */}
        {/* PROCESSING ERRORS */}
        <section className="flex flex-col space-y-8 text-secondary-foreground leading-relaxed">
          <h4 className="font-medium text-foreground capitalize">
            The Processing Errors
          </h4>
          <p>
            Second class of errors is the{" "}
            <span className="font-medium">Processing Errors</span> which occur
            when our server receives the form data and starts performing
            actions. These types of errors are related to the form as a whole,
            and likely something unexpected is happening.
          </p>
          <p>
            Since processing errors are linked to form submission, the error
            could be treated as a returning from a form upon submission.
          </p>
          <div className="w-[calc(100%+1.25rem)] flex flex-col space-y-4">
            <div className="w-full bg-card border-border/50 border rounded -translate-x-2.5 relative">
              <FormWithStatus />
            </div>
            <p className="text-muted-foreground text-sm mx-auto">Form processing errors should be treated as a form return.</p>
          </div>
          <p>
            Note that an error screen clearly indicates the form state — there
            is an error — while different types of notification systems leave
            the state ambiguous.
          </p>
          <p>
            Additionally, we clearly indicate that we understand what kind of
            error occurred and what we will do to help the user.
          </p>
        </section>

        {/* 
        <section className="flex flex-col space-y-8  text-secondary-foreground mb-16 leading-relaxed">
          <h4 className="font-medium text-foreground capitalize">
            Explaining what should user do with the error
          </h4>
          <p>
            Without proper explanations indicating where did error happen is
            useless. Users need to understand what they should do next to
            recover from error.
          </p>
          <p>
            There is some rules of thumb to write a good error messages
            <ul>
              <li>
                <p>Be short, simple and relevant</p>
                <p>
                  Message should address only the current error and provide only
                  information only relevant to fixing the error
                </p>
              </li>
              <li>
                <p>Suggest clear actions</p>
                <p>
                  Decrease the cognitive load, asking user to take direct
                  actions to fix the error
                </p>
              </li>
              <li>
                <p>Show care</p>
                <p>
                  If users have not to do with an error, explain them what you
                  gonna do to fix the situation
                </p>
              </li>
              <li>
                <p>Mock the data</p>
                <p>
                  If error related to the shape of data, provide clear example
                  of expected data
                </p>
              </li>
              <li>
                <p>Use pictograms</p>
                <p>
                  Pictograms help to grasp current status of the system almost
                  immediately
                </p>
              </li>
              <li>
                <p>Link additional resources</p>
                <p>
                  If explaining cause of the error is too complex, but still
                  relevant to user, link it.
                </p>
              </li>
            </ul>
          </p>
        </section>
        */}
        {/* Additional Techiques */}
        {/*
        <section className="flex flex-col space-y-8  text-secondary-foreground mb-16 leading-relaxed">
          <h4 className="font-medium capitalize text-foreground">
            Additional Techiques
          </h4>
          <p>To make form errors more immersive, we can add visual effects, such as blocking the submit button until form fields are valid, flashing the fields, and adding animation gestures.</p>
          <div className="w-[calc(100%+1.25rem)] flex flex-col space-y-4">
            <div className="w-full bg-card border-border/50 border rounded -translate-x-2.5 relative">
              <FormAnimatedExample/>
            </div>
          </div>
          <p>...</p>
        </section>
         */}
        {/* MORE TO ADD */}
        <section className="flex flex-col space-y-1.5 text-secondary-foreground mb-16 leading-relaxed">
          <h4 className="font-medium capitalize text-foreground">
            More to add
          </h4>
          <Separator />
          <ul className="list-decimal list-inside">
            <li>Dealing with Async</li>
            <li>Error messages copywritting</li>
            <li>Code examples</li>
            <li>a11y</li>
          </ul>
        </section>
      </article>
    </main>
  );
}
