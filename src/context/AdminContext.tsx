import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PizzaSabor {
  nome: string;
  ingredientes: string[];
  precos: { [key: string]: number };
  categoria: string;
  imagem?: string;
  disponivel?: boolean;
}

interface PastelSabor {
  nome: string;
  ingredientes: string[];
  preco: number;
  imagem?: string;
  disponivel?: boolean;
}

interface Bebida {
  nome: string;
  tamanho: string;
  preco: number;
  categoria: string;
  imagem?: string;
  disponivel?: boolean;
}

interface Combo {
  nome: string;
  itens: string[];
  preco: number;
  editavel: boolean;
  disponivel?: boolean;
}

interface MenuData {
  pizzas_tradicionais: { [key: string]: PizzaSabor };
  pizzas_doces: { [key: string]: PizzaSabor };
  pasteis_assados: { [key: string]: PastelSabor };
  pasteis_premium: { [key: string]: PastelSabor };
  calzones: { [key: string]: PizzaSabor };
  bebidas: { [key: string]: Bebida };
  combos: { [key: string]: Combo };
}

interface PizzeriaInfo {
  nome: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  horario: string;
  taxaEntrega: number;
  tempoEntrega: string;
  areaEntrega: string[];
}

interface AdminContextType {
  menuData: MenuData;
  pizzeriaInfo: PizzeriaInfo;
  updateMenuItem: (category: string, id: string, data: any) => void;
  addMenuItem: (category: string, id: string, data: any) => void;
  removeMenuItem: (category: string, id: string) => void;
  updatePizzeriaInfo: (data: Partial<PizzeriaInfo>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [menuData, setMenuData] = useState<MenuData>({
    pizzas_tradicionais: {
      margherita: {
        nome: "Margherita",
        ingredientes: ["molho de tomate", "queijo mussarela", "manjericão", "azeite"],
        precos: { P: 25, M: 35, G: 45 },
        categoria: "tradicional",
        disponivel: true
      },
      calabresa: {
        nome: "Calabresa",
        ingredientes: ["calabresa", "cebola", "azeitona", "queijo mussarela"],
        precos: { P: 28, M: 38, G: 48 },
        categoria: "tradicional",
        disponivel: true
      },
      portuguesa: {
        nome: "Portuguesa",
        ingredientes: ["presunto", "ovos", "cebola", "azeitona", "queijo mussarela"],
        precos: { P: 32, M: 42, G: 52 },
        categoria: "especial",
        disponivel: true
      },
      quatroQueijos: {
        nome: "Quatro Queijos",
        ingredientes: ["mussarela", "parmesão", "gorgonzola", "catupiry"],
        precos: { P: 35, M: 45, G: 55 },
        categoria: "especial",
        disponivel: true
      },
      frango: {
        nome: "Frango com Catupiry",
        ingredientes: ["frango desfiado", "catupiry", "milho", "azeitona"],
        precos: { P: 30, M: 40, G: 50 },
        categoria: "tradicional",
        disponivel: true
      },
      pepperoni: {
        nome: "Pepperoni",
        ingredientes: ["pepperoni", "queijo mussarela", "orégano"],
        precos: { P: 33, M: 43, G: 53 },
        categoria: "especial",
        disponivel: true
      }
    },
    pizzas_doces: {
      chocolate: {
        nome: "Chocolate",
        ingredientes: ["chocolate ao leite", "leite condensado"],
        precos: { P: 25, M: 35, G: 45 },
        categoria: "doce",
        disponivel: true
      },
      brigadeiro: {
        nome: "Brigadeiro",
        ingredientes: ["brigadeiro", "granulado", "leite condensado"],
        precos: { P: 28, M: 38, G: 48 },
        categoria: "doce",
        disponivel: true
      }
    },
    pasteis_assados: {
      toscana: {
        nome: "Pastel de Toscana",
        ingredientes: ["calabresa", "queijo", "tomate"],
        preco: 8.00,
        disponivel: true
      },
      frango: {
        nome: "Pastel de Frango com Mussarela",
        ingredientes: ["frango desfiado", "queijo mussarela"],
        preco: 8.50,
        disponivel: true
      },
      cheddar: {
        nome: "Pastel de Cheddar",
        ingredientes: ["queijo cheddar"],
        preco: 7.50,
        disponivel: true
      },
      frangoCheddar: {
        nome: "Pastel de Frango com Cheddar",
        ingredientes: ["frango desfiado", "queijo cheddar"],
        preco: 9.00,
        disponivel: true
      },
      frangoCatupiry: {
        nome: "Pastel de Frango Catupiry",
        ingredientes: ["frango desfiado", "catupiry"],
        preco: 9.50,
        disponivel: true
      },
      frangoAcebolado: {
        nome: "Pastel de Frango Acebolado",
        ingredientes: ["frango desfiado", "cebola refogada"],
        preco: 8.50,
        disponivel: true
      },
      catupiry: {
        nome: "Pastel de Catupiry",
        ingredientes: ["catupiry"],
        preco: 8.00,
        disponivel: true
      },
      calaCheddar: {
        nome: "Pastel de Cala Cheddar",
        ingredientes: ["calabresa", "queijo cheddar"],
        preco: 9.00,
        disponivel: true
      },
      calabresaAcebolada: {
        nome: "Pastel de Calabresa Acebolada",
        ingredientes: ["calabresa", "cebola refogada"],
        preco: 8.50,
        disponivel: true
      },
      calabresa: {
        nome: "Pastel de Calabresa",
        ingredientes: ["calabresa"],
        preco: 8.00,
        disponivel: true
      },
      barbecue: {
        nome: "Pastel de Barbecue",
        ingredientes: ["carne", "molho barbecue"],
        preco: 9.50,
        disponivel: true
      },
      quatroQueijos: {
        nome: "Pastel Quatro Queijos",
        ingredientes: ["mussarela", "parmesão", "gorgonzola", "catupiry"],
        preco: 10.00,
        disponivel: true
      },
      baiana: {
        nome: "Pastel Baiana",
        ingredientes: ["calabresa", "ovo", "pimenta"],
        preco: 9.00,
        disponivel: true
      },
      americano: {
        nome: "Pastel Americano",
        ingredientes: ["presunto", "queijo", "ovo"],
        preco: 9.50,
        disponivel: true
      }
    },
    pasteis_premium: {
      carneSolCatupiry: {
        nome: "Carne de Sol com Catupiry",
        ingredientes: ["carne de sol", "catupiry"],
        preco: 12.00,
        disponivel: true
      },
      carneSolCheddar: {
        nome: "Carne de Sol com Cheddar",
        ingredientes: ["carne de sol", "queijo cheddar"],
        preco: 12.00,
        disponivel: true
      },
      cheesePremium: {
        nome: "Cheese Premium",
        ingredientes: ["queijos especiais", "herbs"],
        preco: 11.00,
        disponivel: true
      },
      baconEspecial: {
        nome: "Bacon Especial",
        ingredientes: ["bacon", "queijo", "cebola caramelizada"],
        preco: 11.50,
        disponivel: true
      },
      calaBacon: {
        nome: "Cala Bacon",
        ingredientes: ["calabresa", "bacon", "queijo"],
        preco: 12.50,
        disponivel: true
      },
      camarao: {
        nome: "Camarão",
        ingredientes: ["camarão", "cream cheese", "herbs"],
        preco: 15.00,
        disponivel: true
      },
      carneSolCreamCheese: {
        nome: "Carne de Sol com Cream Cheese",
        ingredientes: ["carne de sol", "cream cheese"],
        preco: 13.00,
        disponivel: true
      },
      carneSol: {
        nome: "Carne de Sol",
        ingredientes: ["carne de sol", "queijo coalho"],
        preco: 11.00,
        disponivel: true
      }
    },
    calzones: {
      margherita: {
        nome: "Calzone Margherita",
        ingredientes: ["molho de tomate", "queijo mussarela", "manjericão"],
        precos: { P: 22, M: 32, G: 42 },
        categoria: "tradicional",
        disponivel: true
      },
      calabresa: {
        nome: "Calzone Calabresa",
        ingredientes: ["calabresa", "cebola", "queijo mussarela"],
        precos: { P: 25, M: 35, G: 45 },
        categoria: "tradicional",
        disponivel: true
      }
    },
    bebidas: {
      cocaCola: {
        nome: "Coca-Cola",
        tamanho: "350ml",
        preco: 5.00,
        categoria: "refrigerante",
        disponivel: true
      },
      cocaCola1L: {
        nome: "Coca-Cola",
        tamanho: "1L",
        preco: 8.00,
        categoria: "refrigerante",
        disponivel: true
      },
      guarana: {
        nome: "Guaraná Antarctica",
        tamanho: "350ml",
        preco: 5.00,
        categoria: "refrigerante",
        disponivel: true
      },
      fanta: {
        nome: "Fanta Laranja",
        tamanho: "350ml",
        preco: 5.00,
        categoria: "refrigerante",
        disponivel: true
      },
      cajuina: {
        nome: "Cajuína",
        tamanho: "300ml",
        preco: 4.50,
        categoria: "suco",
        disponivel: true
      },
      agua: {
        nome: "Água Mineral",
        tamanho: "500ml",
        preco: 3.00,
        categoria: "agua",
        disponivel: true
      }
    },
    combos: {
      comboCasal: {
        nome: "Combo Casal",
        itens: ["1 Calzone tamanho pequeno", "1 Caixa número 25", "1 Cajuína ou 1 Coca-Cola 1L Original"],
        preco: 45.00,
        editavel: true,
        disponivel: true
      }
    }
  });

  const [pizzeriaInfo, setPizzeriaInfo] = useState<PizzeriaInfo>({
    nome: "Borda de Fogo Pizzaria",
    endereco: "Rua das Pizzas, 123 - Centro - Sua Cidade/SP",
    telefone: "(11) 99999-9999",
    whatsapp: "5511999999999",
    horario: "Segunda a Domingo - 18h00 às 23h30",
    taxaEntrega: 5.00,
    tempoEntrega: "30-45 minutos",
    areaEntrega: ["Centro", "Vila Nova", "Jardim das Flores"]
  });

  const updateMenuItem = (category: string, id: string, data: any) => {
    setMenuData(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof MenuData],
        [id]: { ...prev[category as keyof MenuData][id], ...data }
      }
    }));
  };

  const addMenuItem = (category: string, id: string, data: any) => {
    setMenuData(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof MenuData],
        [id]: data
      }
    }));
  };

  const removeMenuItem = (category: string, id: string) => {
    setMenuData(prev => {
      const newCategory = { ...prev[category as keyof MenuData] };
      delete newCategory[id];
      return {
        ...prev,
        [category]: newCategory
      };
    });
  };

  const updatePizzeriaInfo = (data: Partial<PizzeriaInfo>) => {
    setPizzeriaInfo(prev => ({ ...prev, ...data }));
  };

  const value: AdminContextType = {
    menuData,
    pizzeriaInfo,
    updateMenuItem,
    addMenuItem,
    removeMenuItem,
    updatePizzeriaInfo
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};