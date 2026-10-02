import { useState } from "react";
import { useGame } from "../context/GameContext";

function Inventory() {
  const [open, setOpen] = useState(false);

  const { inventory } = useGame();

  return (
    <div className="inventory">
      <button
        className="inventory-button"
        onClick={() => setOpen((value) => !value)}
      >
        EVIDENCE
        <span>{inventory.length}</span>
      </button>

      {open && (
        <div className="inventory-panel">
          <p className="inventory-title">
            COLLECTED EVIDENCE
          </p>

          {inventory.length === 0 ? (
            <p className="empty-inventory">
              No evidence collected.
            </p>
          ) : (
            inventory.map((item) => (
              <div
                className="inventory-item"
                key={item.id}
              >
                <strong>{item.name}</strong>

                <p>{item.description}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Inventory;