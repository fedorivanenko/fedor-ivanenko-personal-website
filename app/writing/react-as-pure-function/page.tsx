import { CodeBlock } from "@/components/code-block";
import { Section, sectionVariants } from "@/components/layout/section";
import { InlineLinkButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Page() {

    return (
      <article className="animation-container">
        <h1
          className={cn(sectionVariants(), "animate-blur-fade stagger mb-12")}
        >
          React as Pure Function
        </h1>
        <Section>
          <p>
            A great{" "}
            <InlineLinkButton href="https://x.com/dillon_mulroy/status/1975656699685171670">
              tweet
            </InlineLinkButton>{" "}
            by @dillon_mulroy got me thinking about what is the React mindset.
          </p>

          <p>
            I have to start by taking a look at the year 2013,{" "}
            <span className="whitespace-nowrap">when React was created</span>.
          </p>

          <p>
            Back then, the Model-View-Controller (MVC) model dominated. Both the
            View and Model were mutable objects, which the framework kept in
            sync using controllers.
          </p>
        </Section>
        <Section>
          <p>Let{"'"}s take a look at Angular 1.x example:</p>
          <CodeBlock lang="angular-html">
            {[
              '<body ng-controller="DemoController">',
              '  <input ng-model="user.name">',
              "  <p>Hello, {{ user.name }}</p>",
              "  <script>",
              "    app.controller('DemoController', function ($scope) {",
              "      $scope.user = { name: '' };",
              "    });",
              "  </script>",
              "</body>",
            ].join("\n")}
          </CodeBlock>
          <p>
            <code>ng-model</code> creates a watcher that keeps the model (
            <code>user.name</code>) and the view (<code>&lt;input&gt;</code>)
            synchronized. When the user changes the input element in the DOM,
            Angular’s watcher updates the model and then updates the DOM
            accordingly.
          </p>

          <p>
            The problem was that thousands of watchers were mutating the DOM
            individually during each digest cycle. This had roughly{" "}
            <code>𝖮(number of watchers × number of passes)</code> complexity and
            could lead to DOM conflicts.
          </p>
        </Section>
        <Section>
          <p>React acted differently:</p>
          <CodeBlock lang="jsx">
            {[
              "var App = React.createClass({",
              "  getInitialState: function () {",
              "    return { user: { name: '' } };",
              "  },",
              "  handleChange: function (event) {",
              "    this.setState({ user: { name: event.target.value } });",
              "  },",
              "  render: function () {",
              "    return (",
              "      <div>",
              "        <input",
              "          value={this.state.user.name}",
              "          onChange={this.handleChange}",
              "        />",
              "        <p>Hello, {this.state.user.name}</p>",
              "      </div>",
              "    );",
              "  }",
              "});",
            ].join("\n")}
          </CodeBlock>
          <p>
            Here he DOM is never <em>mutated</em>; it is only <em>derived</em>{" "}
            from <code>this.state</code>.
          </p>

          <p>
            The whole React concept can be summarized as:
            <br />
            The UI is a pure function of state and props
          </p>

          <p>
            This allows React to collect all state changes and apply them
            together in a single render/reconciliation cycle. No DOM conflicts
            and roughly <code>𝖮(number of diffs)</code> complexity.
          </p>
        </Section>
        <Section>
          <p>With the functional syntax the model is even more obvious:</p>
          <CodeBlock lang="jsx">
            {[
              "function App() {",
              "  const [user, setUser] = useState({ name: '' });",
              "  function handleChange(event) {",
              "    setUser({ name: event.target.value });",
              "  }",
              "  useEffect(() => {",
              "    if (user.name) {",
              "      console.log(user.name);",
              "    }",
              "  }, [user.name]);",
              "  return (",
              "    <div>",
              "      <input value={user.name} onChange={handleChange} />",
              "      <p>Hello, {user.name}</p>",
              "    </div>",
              "  );",
              "}",
            ].join("\n")}
          </CodeBlock>
          <p>
            The function returns a new UI derived from state and props and runs
            some side effects.
          </p>

          <p>
            React forces developers to think of the UI as a pure function of
            data → what data the component depends on, how the UI should change
            when that data changes, and which side effects should run as a
            result.
          </p>

          <p>
            This makes the entire data flow explicit → you can see exactly where
            data enters (<code>props</code>), how it transforms (
            <code>state</code>) , and where it leaves (<code>render</code>) or (
            <code>effects</code>).
          </p>

          <p>
            Which naturally leads to better abstractions and clearer separation
            of concerns.
          </p>
        </Section>
        <Section>
          <p>
            For example, using this mental model is very easy to catch why this
            is bad <em>conceptually</em>
          </p>
          <CodeBlock>
            {[
              "function Toast({ open }: { open: boolean }) {",
              "  const controls = useAnimation();",
              "",
              "  const variants = {",
              "    open:  { opacity: 1, y: 0,   transition: { duration: 0.24 } },",
              "    close: { opacity: 0, y: -12, transition: { duration: 0.18 } }",
              "  };",
              "",
              "  useEffect(() => {",
              '    controls.start(open ? "open" : "close");',
              "  }, [open, controls, variants]);",
              "",
              "  return (",
              "    <motion.div ",
              '      initial="close" ',
              "      animate={controls} ",
              "      variants={variants}",
              "    >",
              "      ...",
              "    </motion.div>",
              "  )",
              "}",
            ].join("\n")}
          </CodeBlock>
          <p>
            Conceptually, <code>variants</code> behaves like props that define
            how the component should animate. Keeping it inside makes the
            component’s output depend on an unstable internal value.
          </p>

          <p>
            <code>variants</code> define how the animation looks, not when it
            runs. Putting them inside the component mixes animation policy with
            runtime logic. That means when, sixteen components later, you decide
            to make every animation slightly faster, it won’t be fun.
          </p>

          <p>
            Moving it outside the component (ideally into CSS) keeps things easy
            to track. And&nbsp;when we decide to expand the animation system,
            all configuration is already centralized.
          </p>
        </Section>
        <Section>
          <h2>Takeways</h2>
          <ul className="prose-short">
            <li>In React, the UI is a direct projection of data.</li>
            <li>The render is pure, fully determined by props and state.</li>
            <li>
              Making the entire data flow explicit naturally leads to better
              abstractions and{" "}
              <span className="xs:whitespace-nowrap">
                a clearer separation of concerns
              </span>
            </li>
          </ul>
        </Section>
        <Section>
          <h2>Readings</h2>
          <ul className="space-y-1">
              <li>
                <InlineLinkButton href="https://legacy.reactjs.org/blog/2013/06/05/why-react.html">
                  Pete Hunt. “Why did we build React?“ (2013)
                </InlineLinkButton>
              </li>
              <li>
                <InlineLinkButton href="https://legacy.reactjs.org/docs/react-component.html">
                  React Team. “React Component API.” (2013)
                </InlineLinkButton>
              </li>
              <li>
                <InlineLinkButton href="https://2013.jsconf.eu/speakers/pete-hunt-react-rethinking-best-practices.html">
                  Pete Hunt. “React: Rethinking Best Practices.” (2013). JSConf
                  EU
                </InlineLinkButton>
              </li>
            </ul>
        </Section>
      </article>
    );
}