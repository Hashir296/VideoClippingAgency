import { createContext, useCallback, useContext, useState } from 'react';

const Ctx = createContext(null);

export function AuditProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [pkg, setPkg] = useState('Growth');
  const openAudit = useCallback((p) => {
    if (p) setPkg(p);
    setOpen(true);
  }, []);
  const closeAudit = useCallback(() => setOpen(false), []);
  return <Ctx.Provider value={{ open, pkg, setPkg, openAudit, closeAudit }}>{children}</Ctx.Provider>;
}

export const useAudit = () => useContext(Ctx);
