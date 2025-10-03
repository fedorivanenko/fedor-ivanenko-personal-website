"use client";

export default function Home() {
  return (
    <>
      <style jsx>{`
        .watch {
            animation: radius linear forwards;
            animation-timeline: view();
            animation-range: exit-crossing 0px exit-crossing 100px;
            
            border-radius: 20px;
            
            position: sticky;
            top: -100px
            height: 100px;
            transform: translateY(100px);
            
            background-color: #2563eb;
            width: 200px;
        }

        @keyframes radius {
            from {
                border-radius: 20px;
            }
            to {
                border-radius: 0px;
            }
        }

        .main-container {
          min-height: 120vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 5rem;
        }
      `}</style>

      <main className="main-container">
        <div className="watch" />
      </main>
    </>
  );
}
