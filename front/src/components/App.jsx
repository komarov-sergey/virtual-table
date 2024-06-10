import VirtualTable from "./VirtualTable";

const App = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      <VirtualTable id="1" />
      {/* <VirtualTable id="2" /> */}
    </div>
  );
};

export default App;
