import React from "react";
import { Button } from "@/components/ui/button";

type Role = "sysadmin" | "ceo";

interface RoleToggleProps {
  value: Role;
  onChange: (r: Role) => void;
}

const RoleToggle: React.FC<RoleToggleProps> = ({ value, onChange }) => {
  return (
    <div className="inline-flex items-center gap-2 p-1 rounded-full border bg-card">
      <Button variant={value === "sysadmin" ? "neon" : "outline"} size="sm" onClick={() => onChange("sysadmin")}>SysAdmin</Button>
      <Button variant={value === "ceo" ? "neon" : "outline"} size="sm" onClick={() => onChange("ceo")}>CEO</Button>
    </div>
  );
};

export default RoleToggle;
