import React, { useState, useEffect } from 'react';

// === CONSTANTS ===
const PRODUCE_TYPES = ['Fruit', 'Vegetable', 'Bread', 'Breakfast', 'Carbohydrates', 'Meat', 'Dairy', 'Canned', 'Frozen', 'Beverage', 'Snack', 'Condiment', 'Baking', 'Other'];
const TEMPLATE_ICONS = ['🛒', '🥛', '🍞', '🥚', '🍎', '🥬', '🍗', '🥩', '🍝', '🍛', '☕', '🧺'];
const UNITS = ['L', 'ml', 'g', 'kg', 'cups', 'tbsp', 'tsp', 'pcs', 'cans', 'loaf', 'Rolls', 'head', 'cloves', 'bags', 'box', 'bottle', 'bunch', 'pack'];

const TEMPLATE_CATEGORIES = {
  BASICS: 'Basics',
  RECIPE: 'Recipe'
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const DEFAULT_TEMPLATES = {
  empty: { name: 'Empty List', icon: '📝', category: TEMPLATE_CATEGORIES.BASICS, items: [] },
  weekly: {
    name: 'Weekly Basics', icon: '🛒', category: TEMPLATE_CATEGORIES.BASICS,
    items: [
      { name: 'Milk', brand: '', quantity: 2, unit: 'L', store: '', produceType: 'Dairy' },
      { name: 'Bread', brand: '', quantity: 1, unit: 'loaf', store: '', produceType: 'Bread' },
      { name: 'Eggs', brand: '', quantity: 12, unit: '', store: '', produceType: 'Dairy' },
      { name: 'Butter', brand: '', quantity: 250, unit: 'g', store: '', produceType: 'Dairy' },
      { name: 'Cheese', brand: '', quantity: 200, unit: 'g', store: '', produceType: 'Dairy' },
      { name: 'Yogurt', brand: '', quantity: 4, unit: 'cups', store: '', produceType: 'Dairy' },
      { name: 'Bananas', brand: '', quantity: 6, unit: '', store: '', produceType: 'Fruit' },
      { name: 'Apples', brand: '', quantity: 6, unit: '', store: '', produceType: 'Fruit' }
    ]
  },
  bolognese: {
    name: 'Spaghetti Bolognese', icon: '🍝', category: TEMPLATE_CATEGORIES.RECIPE, servings: 4,
    items: [
      { name: 'Spaghetti', brand: '', quantity: 400, unit: 'g', store: '', produceType: 'Baking' },
      { name: 'Ground Beef', brand: '', quantity: 500, unit: 'g', store: '', produceType: 'Meat' },
      { name: 'Tomatoes', brand: '', quantity: 2, unit: 'cans', store: '', produceType: 'Canned' },
      { name: 'Onion', brand: '', quantity: 1, unit: '', store: '', produceType: 'Vegetable' },
      { name: 'Garlic', brand: '', quantity: 2, unit: 'cloves', store: '', produceType: 'Vegetable' },
      { name: 'Carrot', brand: '', quantity: 1, unit: '', store: '', produceType: 'Vegetable' }
    ]
  },
  stirfry: {
    name: 'Chicken Stir Fry', icon: '🍗', category: TEMPLATE_CATEGORIES.RECIPE, servings: 4,
    items: [
      { name: 'Chicken Breast', brand: '', quantity: 500, unit: 'g', store: '', produceType: 'Meat' },
      { name: 'Bell Peppers', brand: '', quantity: 2, unit: '', store: '', produceType: 'Vegetable' },
      { name: 'Broccoli', brand: '', quantity: 1, unit: 'head', store: '', produceType: 'Vegetable' },
      { name: 'Soy Sauce', brand: '', quantity: 3, unit: 'tbsp', store: '', produceType: 'Condiment' },
      { name: 'Rice', brand: '', quantity: 300, unit: 'g', store: '', produceType: 'Baking' }
    ]
  },
  curry: {
    name: 'Vegetable Curry', icon: '🍛', category: TEMPLATE_CATEGORIES.RECIPE, servings: 4,
    items: [
      { name: 'Chickpeas', brand: '', quantity: 2, unit: 'cans', store: '', produceType: 'Canned' },
      { name: 'Coconut Milk', brand: '', quantity: 1, unit: 'can', store: '', produceType: 'Canned' },
      { name: 'Potatoes', brand: '', quantity: 3, unit: '', store: '', produceType: 'Vegetable' },
      { name: 'Carrots', brand: '', quantity: 2, unit: '', store: '', produceType: 'Vegetable' },
      { name: 'Onion', brand: '', quantity: 1, unit: '', store: '', produceType: 'Vegetable' },
      { name: 'Curry Paste', brand: '', quantity: 2, unit: 'tbsp', store: '', produceType: 'Condiment' },
      { name: 'Spinach', brand: '', quantity: 200, unit: 'g', store: '', produceType: 'Vegetable' },
      { name: 'Rice', brand: '', quantity: 300, unit: 'g', store: '', produceType: 'Baking' }
    ]
  },
  breakfast: {
    name: 'Breakfast Essentials', icon: '🍳', category: TEMPLATE_CATEGORIES.BASICS,
    items: [
      { name: 'Milk', brand: '', quantity: 1, unit: 'L', store: '', produceType: 'Dairy' },
      { name: 'Bread', brand: '', quantity: 1, unit: 'loaf', store: '', produceType: 'Bread' },
      { name: 'Eggs', brand: '', quantity: 12, unit: '', store: '', produceType: 'Dairy' },
      { name: 'Butter', brand: '', quantity: 250, unit: 'g', store: '', produceType: 'Dairy' },
      { name: 'Cereal', brand: '', quantity: 1, unit: 'box', store: '', produceType: 'Baking' },
      { name: 'Coffee', brand: '', quantity: 250, unit: 'g', store: '', produceType: 'Beverage' },
      { name: 'Tea', brand: '', quantity: 20, unit: 'bags', store: '', produceType: 'Beverage' }
    ]
  }
};

const LIGHT_THEME = {
  pageBg: '#ffffff', surface: '#ffffff', subtle: '#f8f9fa', border: '#ddd', borderLight: '#eee', text: '#212529', textMuted: '#666', highlight: '#e9f5ff', inputBg: '#ffffff', disabled: '#ccc', dangerBg: '#fee', dangerBorder: '#fcc'
};
const DARK_THEME = {
  pageBg: '#1a1d21', surface: '#24282d', subtle: '#2b3035', border: '#3a3f45', borderLight: '#33383e', text: '#e8e8e8', textMuted: '#9aa0a6', highlight: '#1e3a5f', inputBg: '#2b3035', disabled: '#4a4f55', dangerBg: '#3a2020', dangerBorder: '#5a3030'
};

const makeStyles = (t) => ({
  container: { maxWidth: '100%', margin: '0 auto', padding: '10px', background: t.pageBg, color: t.text, minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' },
  btn: { padding: '12px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', minHeight: '44px', minWidth: '44px' },
  btnPrimary: { background: '#007bff', color: '#fff' },
  btnSecondary: { background: '#6c757d', color: '#fff' },
  btnSuccess: { background: '#28a745', color: '#fff' },
  deleteBtn: { background: t.dangerBg, border: `1px solid ${t.dangerBorder}`, cursor: 'pointer', color: t.textMuted, padding: '4px 8px', borderRadius: '4px' },
  card: { background: t.surface, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '15px', cursor: 'pointer', marginBottom: '10px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  item: { display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${t.borderLight}` },
  checkbox: { marginRight: '12px', width: '20px', height: '20px' },
  modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { background: t.surface, color: t.text, borderRadius: '8px', padding: '20px', maxWidth: '95vw', width: '95%', maxHeight: '85vh', overflowY: 'auto' },
  templatesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '15px' },
  template: { background: t.subtle, border: `2px solid ${t.border}`, borderRadius: '8px', padding: '15px', cursor: 'pointer', textAlign: 'center' },
  templateSelected: { background: t.highlight, borderColor: '#007bff' },
  addForm: { display: 'flex', gap: '10px', padding: '15px', background: t.subtle },
  addFormInput: { flex: 1, padding: '10px', border: `1px solid ${t.border}`, borderRadius: '5px', fontSize: '16px', background: t.inputBg, color: t.text },
  summaryBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', padding: '10px', background: t.subtle, borderRadius: '5px' },
  actionButtons: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px', flexWrap: 'wrap' }
});

const cloneItem = (item) => ({
  id: generateId(),
  name: item.name || '',
  brand: item.brand || '',
  quantity: item.quantity || 0,
  unit: item.unit || '',
  store: item.store || '',
  produceType: item.produceType || '',
  purchased: false
});

export default function App() {
  const [lists, setLists] = useState(() => {
    const saved = localStorage.getItem('groceryLists');
    return saved ? JSON.parse(saved) : [];
  });

  const [templates, setTemplates] = useState(() => {
    const saved = localStorage.getItem('groceryTemplates');
    return saved ? JSON.parse(saved) : DEFAULT_TEMPLATES;
  });

  const [itemDatabase, setItemDatabase] = useState(() => {
    const saved = localStorage.getItem('itemDatabase');
    if (saved) return JSON.parse(saved);
    const allItems = [];
    const seen = new Set();
    Object.values(DEFAULT_TEMPLATES).forEach(template => {
      template.items.forEach(item => {
        const key = item.name.toLowerCase().trim();
        if (!seen.has(key)) {
          seen.add(key);
          allItems.push({ id: generateId(), name: item.name, brand: '', store: '', produceType: item.produceType || '', quantity: 0, unit: '' });
        }
      });
    });
    return allItems;
  });

  const [currentListId, setCurrentListId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState({});
  const [templateServings, setTemplateServings] = useState({});
  const [newItemName, setNewItemName] = useState('');
  const [databaseSearch, setDatabaseSearch] = useState('');
  const [showItemDatabase, setShowItemDatabase] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [newItemId, setNewItemId] = useState(null);
  const [autocompleteIndex, setAutocompleteIndex] = useState(-1);
  const [editingTemplateKey, setEditingTemplateKey] = useState(null);
  const [listToDelete, setListToDelete] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const t = darkMode ? DARK_THEME : LIGHT_THEME;
  const styles = makeStyles(t);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
  useEffect(() => {
    localStorage.setItem('groceryLists', JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem('groceryTemplates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('itemDatabase', JSON.stringify(itemDatabase));
  }, [itemDatabase]);

  useEffect(() => {
    if (itemDatabase.length === 0) return;
    setTemplates(prev => {
      let changed = false;
      const next = {};
      Object.entries(prev).forEach(([key, template]) => {
        const items = template.items.map(item => {
          const db = itemDatabase.find(db => db.name.toLowerCase().trim() === (item.name || '').toLowerCase().trim());
          if (!db) return item;
          const updated = {
            ...item,
            unit: db.unit || item.unit,
            produceType: db.produceType || item.produceType,
            brand: db.brand || item.brand,
            store: db.store || item.store
          };
          if (updated !== item && JSON.stringify(updated) !== JSON.stringify(item)) changed = true;
          return updated;
        });
        next[key] = { ...template, items };
      });
      return changed ? next : prev;
    });
  }, [itemDatabase]);

  useEffect(() => {
    if (itemDatabase.length === 0) {
      const allItems = [];
      const seen = new Set();
      Object.values(templates).forEach(template => {
        template.items.forEach(item => {
          const key = item.name.toLowerCase().trim();
          if (!seen.has(key)) {
            seen.add(key);
            allItems.push({ id: generateId(), name: item.name, brand: '', store: '', produceType: item.produceType || '', quantity: 0, unit: '' });
          }
        });
      });
      if (allItems.length > 0) setItemDatabase(allItems);
    }
  }, [templates]);

  const currentList = lists.find(l => l.id === currentListId);

  // Template Editor Functions
  const openTemplateEditor = () => {
    setShowTemplateEditor(true);
    setEditingTemplateKey(null);
  };

  const closeTemplateEditor = () => {
    setShowTemplateEditor(false);
    setEditingTemplateKey(null);
    setShowIconPicker(false);
    setNewItemId(null);
  };

  const startEditingTemplate = (key) => {
    setEditingTemplateKey(key);
  };

  const saveTemplate = (key, updatedTemplate) => {
    setTemplates(prev => ({ ...prev, [key]: updatedTemplate }));
    setItemDatabase(prev => {
      const names = new Set(prev.map(db => db.name.toLowerCase().trim()));
      const additions = [];
      updatedTemplate.items.forEach(item => {
        const name = (item.name || '').trim();
        if (name && !names.has(name.toLowerCase())) {
          names.add(name.toLowerCase());
          additions.push({ id: generateId(), name, brand: item.brand || '', store: item.store || '', produceType: item.produceType || '', quantity: 0, unit: '' });
        }
      });
      return additions.length > 0 ? [...prev, ...additions] : prev;
    });
    setEditingTemplateKey(null);
    setShowIconPicker(false);
  };

  const addNewTemplate = () => {
    const newKey = `template_${Date.now()}`;
    setTemplates(prev => ({
      ...prev,
      [newKey]: {
        name: 'New Template',
        icon: '📋',
        category: TEMPLATE_CATEGORIES.BASICS,
        servings: 1,
        items: []
      }
    }));
    setEditingTemplateKey(newKey);
  };

  const deleteTemplate = (key) => {
    if (Object.keys(templates).length <= 1) {
      alert('You must have at least one template');
      return;
    }
    setTemplates(prev => {
      const newTemplates = { ...prev };
      delete newTemplates[key];
      return newTemplates;
    });
    setSelectedTemplates(prev => {
      const newSel = { ...prev };
      delete newSel[key];
      return newSel;
    });
  };

  const getAutocompleteSuggestions = (query) => {
    const q = (query || '').toLowerCase().trim();
    if (!q) return [];
    return itemDatabase
      .filter(db => db.name.toLowerCase().includes(q))
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(q);
        const bStarts = b.name.toLowerCase().startsWith(q);
        if (aStarts !== bStarts) return aStarts ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .slice(0, 8);
  };
  const selectAutocompleteSuggestion = (templateKey, idx, dbItem) => {
    setTemplates(prev => ({
      ...prev,
      [templateKey]: {
        ...prev[templateKey],
        items: prev[templateKey].items.map((item, i) =>
          i === idx
            ? { ...item, name: dbItem.name, brand: dbItem.brand || item.brand, unit: dbItem.unit || item.unit, store: dbItem.store || item.store, produceType: dbItem.produceType || item.produceType }
            : item
        )
      }
    }));
    setAutocompleteIndex(-1);
    setNewItemId(null);
  };
  const addItemToTemplate = (templateKey) => {
    const newItem = {
      id: generateId(),
      name: '',
      brand: '',
      quantity: 0,
      unit: '',
      store: '',
      produceType: ''
    };
    setTemplates(prev => ({
      ...prev,
      [templateKey]: {
        ...prev[templateKey],
        items: [...prev[templateKey].items, newItem]
      }
    }));
    setNewItemId(newItem.id);
  };

  const removeItemFromTemplate = (templateKey, itemIndex) => {
    setTemplates(prev => ({
      ...prev,
      [templateKey]: {
        ...prev[templateKey],
        items: prev[templateKey].items.filter((_, i) => i !== itemIndex)
      }
    }));
  };

  const updateTemplateField = (templateKey, field, value) => {
    setTemplates(prev => ({
      ...prev,
      [templateKey]: { ...prev[templateKey], [field]: value }
    }));
  };

  const updateTemplateItem = (templateKey, itemIndex, field, value) => {
    setTemplates(prev => ({
      ...prev,
      [templateKey]: {
        ...prev[templateKey],
        items: prev[templateKey].items.map((item, i) =>
          i === itemIndex ? { ...item, [field]: field === 'quantity' ? parseFloat(value) || 0 : value } : item
        )
      }
    }));
  };

  // List Creation
  const createList = () => {
    const allItems = [];
    Object.entries(selectedTemplates).forEach(([key, isSelected]) => {
      if (isSelected) {
        const template = templates[key];
        const servings = templateServings[key] || template.servings || 1;
        const multiplier = template.category === TEMPLATE_CATEGORIES.RECIPE ? servings : 1;
        template.items.forEach(item => {
          const cloned = cloneItem(item);
          if (template.category === TEMPLATE_CATEGORIES.RECIPE && multiplier > 1) {
            cloned.quantity = cloned.quantity * multiplier;
          }
          allItems.push(cloned);
        });
      }
    });

    if (allItems.length === 0) {
      allItems.push(cloneItem({ name: '', brand: '', quantity: 0, unit: '', store: '', produceType: '' }));
    }

    const matchedItems = allItems.map(listItem => {
      const dbItem = itemDatabase.find(db => db.name.toLowerCase() === listItem.name.toLowerCase());
      if (dbItem) {
        return { ...listItem, produceType: dbItem.produceType || listItem.produceType, brand: dbItem.brand || listItem.brand, store: dbItem.store || listItem.store };
      }
      return listItem;
    });

    const sortedItems = [...matchedItems].sort((a, b) => {
      const typeA = (a.produceType || '').toLowerCase();
      const typeB = (b.produceType || '').toLowerCase();
      if (typeA < typeB) return -1;
      if (typeA > typeB) return 1;
      return a.name.localeCompare(b.name);
    });

    const newList = { id: generateId(), name: 'My Shopping List', items: sortedItems };
    setLists([...lists, newList]);
    setSelectedTemplates({});
    setTemplateServings({});
    setShowCreateModal(false);
  };

  const toggleTemplate = (templateKey) => {
    setSelectedTemplates(prev => ({ ...prev, [templateKey]: !prev[templateKey] }));
  };

  const updateServings = (key, newServings) => {
    setTemplateServings(prev => ({ ...prev, [key]: newServings }));
    updateTemplateField(key, 'servings', newServings);
  };

  const selectAllTemplates = () => {
    const allSelected = {};
    Object.keys(templates).forEach(key => { allSelected[key] = true; });
    setSelectedTemplates(allSelected);
  };

  const clearSelections = () => {
    setSelectedTemplates({});
  };

  // List Management
  const deleteList = (listId) => {
    setListToDelete(listId);
  };

  const confirmDelete = () => {
    if (listToDelete) {
      setLists(lists.filter(l => l.id !== listToDelete));
      if (currentListId === listToDelete) setCurrentListId(null);
      setListToDelete(null);
    }
  };

  const toggleItem = (listId, itemId) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return { ...list, items: list.items.map(item => item.id === itemId ? { ...item, purchased: !item.purchased } : item) };
      }
      return list;
    }));
  };

  const deleteItem = (listId, itemId) => {
    setLists(lists.map(list => {
      if (list.id === listId) {
        return { ...list, items: list.items.filter(item => item.id !== itemId) };
      }
      return list;
    }));
  };

  const addItem = (listId, name) => {
    if (name.trim()) {
      let itemName = name.trim();
      let quantity = 0;
      let unit = '';
      const numberMatch = name.trim().match(/(\d+(?:\.\d+)?)/);
      if (numberMatch) {
        const numIndex = name.trim().indexOf(numberMatch[0]);
        itemName = name.trim().substring(0, numIndex).trim();
        const afterNumber = name.trim().substring(numIndex + numberMatch[0].length).trim();
        quantity = parseFloat(numberMatch[0]);
        unit = afterNumber;
      }

      setLists(lists.map(list => {
        if (list.id === listId) {
          return { ...list, items: [...list.items, { id: generateId(), name: itemName || name.trim(), brand: '', quantity, unit, store: '', produceType: '', purchased: false }] };
        }
        return list;
      }));
      setNewItemName('');
    }
  };

  // Item Database
  const openItemDatabase = () => {
    setShowItemDatabase(true);
    setDatabaseSearch('');
  };

  const closeItemDatabase = () => {
    setShowItemDatabase(false);
    setDatabaseSearch('');
  };

  const addDatabaseItem = () => {
    setItemDatabase(prev => [...prev, { id: generateId(), name: '', brand: '', store: '', produceType: '', quantity: 0, unit: '' }]);
  };

  const updateDatabaseItem = (itemId, field, value) => {
    setItemDatabase(prev => prev.map(item => item.id === itemId ? { ...item, [field]: field === 'quantity' ? parseFloat(value) || 0 : value } : item));
  };

  const deleteDatabaseItem = (itemId) => {
    setItemDatabase(prev => prev.filter(item => item.id !== itemId));
  };

  const selectedCount = Object.values(selectedTemplates).filter(Boolean).length;
  const selectedItemCount = Object.entries(selectedTemplates).filter(([key, isSelected]) => isSelected).reduce((sum, [key]) => {
    const template = templates[key];
    const servings = templateServings[key] || template.servings || 1;
    const multiplier = template.category === TEMPLATE_CATEGORIES.RECIPE ? servings : 1;
    return sum + template.items.length * multiplier;
  }, 0);

  // TEMPLATE EDITOR VIEW
  if (showTemplateEditor && editingTemplateKey) {
    const template = templates[editingTemplateKey];
    return (
      <div style={styles.modal}>
        <div style={{ ...styles.modalContent, maxWidth: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: `1px solid ${t.borderLight}` }}>
            <h2 style={{ margin: 0 }}>Edit Template</h2>
            <button onClick={closeTemplateEditor} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: t.textMuted }}>×</button>
          </div>
          {template && (
            <div>
              <div style={{ marginBottom: '15px', paddingBottom: '15px', borderBottom: `1px solid ${t.borderLight}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => setShowIconPicker(prev => !prev)} title="Change icon" style={{ background: t.subtle, border: `1px solid ${t.border}`, borderRadius: '8px', fontSize: '24px', padding: '6px 10px', cursor: 'pointer', lineHeight: 1 }}>{template.icon}</button>
                  <input type="text" value={template.name} onChange={(e) => updateTemplateField(editingTemplateKey, 'name', e.target.value)} style={{ ...styles.addFormInput, flex: 1, fontSize: '18px', fontWeight: 'bold' }} />
                </div>
                {template.category === TEMPLATE_CATEGORIES.RECIPE && (
                  <div style={{ color: t.textMuted, fontSize: '14px', marginTop: '5px' }}>Default servings: {template.servings || 1}</div>
                )}
                {showIconPicker && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginTop: '10px', background: t.subtle, padding: '10px', borderRadius: '8px' }}>
                    {TEMPLATE_ICONS.map(icon => (
                      <button key={icon} onClick={() => { updateTemplateField(editingTemplateKey, 'icon', icon); setShowIconPicker(false); }} style={{ fontSize: '22px', background: template.icon === icon ? t.highlight : t.surface, border: template.icon === icon ? '2px solid #007bff' : `1px solid ${t.border}`, borderRadius: '6px', padding: '8px 0', cursor: 'pointer' }}>{icon}</button>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Items ({template.items.length})</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {template.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', background: t.subtle, padding: '8px', borderRadius: '4px', border: `1px solid ${t.borderLight}` }}>
                      {item.id === newItemId ? (() => {
                        const suggestions = getAutocompleteSuggestions(item.name);
                        return (
                          <div style={{ flex: 1, position: 'relative' }}>
                            <input
                              type="text"
                              value={item.name || ''}
                              onChange={(e) => { updateTemplateItem(editingTemplateKey, idx, 'name', e.target.value); setAutocompleteIndex(-1); }}
                              onBlur={() => {
                                setTimeout(() => {
                                  if (!(item.name || '').trim()) removeItemFromTemplate(editingTemplateKey, idx);
                                  setNewItemId(null);
                                  setAutocompleteIndex(-1);
                                }, 150);
                              }}
                              onKeyDown={(e) => {
                                if (suggestions.length > 0) {
                                  if (e.key === 'ArrowDown') { e.preventDefault(); setAutocompleteIndex(prev => Math.min(prev + 1, suggestions.length - 1)); return; }
                                  if (e.key === 'ArrowUp') { e.preventDefault(); setAutocompleteIndex(prev => Math.max(prev - 1, 0)); return; }
                                  if (e.key === 'Enter' && autocompleteIndex >= 0) { e.preventDefault(); selectAutocompleteSuggestion(editingTemplateKey, idx, suggestions[autocompleteIndex]); return; }
                                }
                                if (e.key === 'Enter') e.target.blur();
                              }}
                              style={{ ...styles.addFormInput, width: '100%' }}
                              placeholder="Item name"
                              autoFocus
                            />
                            {suggestions.length > 0 && (
                              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: t.surface, border: `1px solid ${t.border}`, borderRadius: '5px', marginTop: '2px', zIndex: 100, maxHeight: '240px', overflowY: 'auto', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                                {suggestions.map((db, sIdx) => (
                                  <div
                                    key={db.id}
                                    onMouseDown={(e) => { e.preventDefault(); selectAutocompleteSuggestion(editingTemplateKey, idx, db); }}
                                    onMouseEnter={() => setAutocompleteIndex(sIdx)}
                                    style={{ padding: '10px 12px', cursor: 'pointer', background: sIdx === autocompleteIndex ? t.highlight : 'transparent', color: t.text, fontSize: '14px', display: 'flex', justifyContent: 'space-between', gap: '8px' }}
                                  >
                                    <span>{db.name}</span>
                                    <span style={{ color: t.textMuted, fontSize: '12px' }}>{[db.produceType, db.unit].filter(Boolean).join(' • ')}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })() : (
                        <span style={{ flex: 1 }}>{item.name}{item.brand ? ` (${item.brand})` : ''}</span>
                      )}
                      <input type="number" value={item.quantity || 0} onChange={(e) => updateTemplateItem(editingTemplateKey, idx, 'quantity', e.target.value)} style={{ ...styles.addFormInput, width: '80px' }} placeholder="Qty" min="0" step="0.01" />
                      <span style={{ color: t.textMuted, minWidth: '40px' }}>{item.unit || ''}</span>
                      <button onClick={() => { removeItemFromTemplate(editingTemplateKey, idx); if (item.id === newItemId) setNewItemId(null); }} style={{ ...styles.btn, background: '#dc3545', color: '#fff', padding: '4px 8px', fontSize: '12px' }}>×</button>
                    </div>
                  ))}
                </div>
                <button onClick={() => addItemToTemplate(editingTemplateKey)} style={{ ...styles.btn, ...styles.btnSecondary, padding: '8px 16px', marginTop: '10px' }}>+ Add Item</button>
              </div>
              <div style={styles.actionButtons}>
                <button onClick={() => { saveTemplate(editingTemplateKey, template); closeTemplateEditor(); }} style={{ ...styles.btn, ...styles.btnSuccess }}>Save Changes</button>
                <button onClick={closeTemplateEditor} style={{ ...styles.btn, ...styles.btnSecondary }}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // TEMPLATE SELECTOR VIEW
  if (showTemplateEditor && !editingTemplateKey) {
    return (
      <div style={styles.modal}>
        <div style={{ ...styles.modalContent, maxWidth: '700px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: `1px solid ${t.borderLight}` }}>
            <h2 style={{ margin: 0 }}>Select Template to Edit</h2>
            <button onClick={closeTemplateEditor} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: t.textMuted }}>×</button>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <button onClick={addNewTemplate} style={{ ...styles.btn, ...styles.btnSuccess }}>+ Add New Template</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
            {Object.entries(templates).map(([key, template]) => (
              <div key={key} style={{ background: t.subtle, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '15px', cursor: 'pointer' }} onClick={() => startEditingTemplate(key)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '20px' }}>{template.icon}</span>
                  <strong style={{ fontSize: '16px' }}>{template.name}</strong>
                </div>
                <div style={{ color: t.textMuted, fontSize: '14px' }}>{template.items.length} items</div>
                <div style={{ color: t.textMuted, fontSize: '11px', marginTop: '5px' }}>{template.category}</div>
                <button onClick={(e) => { e.stopPropagation(); deleteTemplate(key); }} style={{ ...styles.btn, background: '#dc3545', color: '#fff', padding: '4px 8px', fontSize: '12px', marginTop: '10px' }}>Delete Template</button>
              </div>
            ))}
          </div>
          <div style={styles.actionButtons}>
            <button onClick={closeTemplateEditor} style={{ ...styles.btn, ...styles.btnSecondary }}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  // GROCERY LIST VIEW
  if (currentListId && currentList) {
    const doneCount = currentList.items.filter(i => i.purchased).length;
    const totalCount = currentList.items.length;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => setCurrentListId(null)} style={styles.btn}>All Lists</button>
          <h1 style={{ margin: 0 }}>{currentList.name}</h1>
          <span>{doneCount}/{totalCount}</span>
        </div>

        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '15px', borderBottom: `1px solid ${t.borderLight}` }}><strong>Shopping List</strong></div>
          <div style={{ padding: '15px', maxHeight: '50vh', overflowY: 'auto' }}>
            {currentList.items.length > 0 ? (
              currentList.items.map(item => (
                <div key={item.id} style={styles.item}>
                  <input type="checkbox" checked={item.purchased} onChange={() => toggleItem(currentList.id, item.id)} style={styles.checkbox} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                      {item.produceType && <span style={{ fontSize: '10px', padding: '2px 6px', background: t.highlight, borderRadius: '3px', color: '#007bff', fontWeight: '500' }}>{item.produceType}</span>}
                    </div>
                    {item.brand && <div style={{ fontSize: '12px', color: '#888' }}>{item.brand}</div>}
                    {item.store && <div style={{ fontSize: '12px', color: '#888' }}>{item.store}</div>}
                  </div>
                  <div style={{ color: t.textMuted, fontSize: '14px', minWidth: '80px', textAlign: 'right' }}>
                    {item.quantity !== 0 && <span>{item.quantity}{item.unit && ' ' + item.unit}</span>}
                    {item.quantity === 0 && item.unit && <span>{item.unit}</span>}
                  </div>
                  <button onClick={() => deleteItem(currentList.id, item.id)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', padding: '5px' }}>🗑️</button>
                </div>
              ))
            ) : <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>Empty list - add some items!</p>}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); addItem(currentList.id, newItemName); }} style={styles.addForm}>
            <input type="text" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="Add item... (e.g., Milk 2L)" style={styles.addFormInput} />
            <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary }}>Add</button>
          </form>
        </div>
      </div>
    );
  }

  // MAIN VIEW
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>My Grocery Lists</h1>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setDarkMode(!darkMode)} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} style={{ ...styles.btn, background: t.subtle, color: t.text }}>{darkMode ? '☀️' : '🌙'}</button>
          <button onClick={openItemDatabase} style={{ ...styles.btn, ...styles.btnSecondary }}>Items</button>
          <button onClick={openTemplateEditor} style={{ ...styles.btn, ...styles.btnSecondary }}>Templates</button>
          <button onClick={() => setShowCreateModal(true)} style={{ ...styles.btn, ...styles.btnPrimary }}>+ New List</button>
        </div>
      </div>

      {lists.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
          {lists.map(list => (
            <div key={list.id} onClick={() => setCurrentListId(list.id)} style={styles.card}>
              <div style={styles.cardHeader}>
                <strong>{list.name}</strong>
                <button onClick={(e) => { e.stopPropagation(); deleteList(list.id); }} style={styles.deleteBtn}>🗑️</button>
              </div>
              <div style={{ color: t.textMuted, fontSize: '14px' }}>{list.items.length} items • {list.items.filter(i => i.purchased).length}/{list.items.length} checked</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: t.textMuted }}>No grocery lists yet</p>
          <button onClick={() => setShowCreateModal(true)} style={{ ...styles.btn, ...styles.btnPrimary, marginTop: '10px' }}>+ Create Your First List</button>
        </div>
      )}

      {showCreateModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: `1px solid ${t.borderLight}` }}>
              <h2 style={{ margin: 0 }}>Create New List</h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: t.textMuted }}>×</button>
            </div>
            <p style={{ color: t.textMuted, marginBottom: '15px' }}><strong>Select templates</strong> to combine:</p>
            <div style={styles.templatesGrid}>
              {Object.entries(templates).map(([key, template]) => {
                const isSelected = selectedTemplates[key] || false;
                const servings = templateServings[key] || template.servings || 1;
                const isRecipe = template.category === TEMPLATE_CATEGORIES.RECIPE;
                return (
                  <button key={key} onClick={(e) => { if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') { e.preventDefault(); e.stopPropagation(); return; } toggleTemplate(key); }} style={{ ...styles.template, ...(isSelected ? styles.templateSelected : {}) }}>
                    <div style={{ fontSize: '24px', marginBottom: '5px' }}>{template.icon}</div>
                    <div style={{ fontWeight: 500, marginBottom: '5px' }}>{template.name}</div>
                    <div style={{ fontSize: '12px', color: t.textMuted }}>{template.items.length} items</div>
                    <div style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '3px', display: 'inline-block', marginTop: '5px', background: isRecipe ? '#fff3cd' : '#d1ecf1', color: isRecipe ? '#856404' : '#0c5460' }}>{template.category}</div>
                    {isRecipe && isSelected && (
                      <div style={{ marginTop: '8px' }}>
                        <label style={{ fontSize: '12px', color: t.textMuted }}>
                          Servings:
                          <input type="number" value={servings} onChange={(e) => updateServings(key, parseInt(e.target.value) || 1)} onClick={(e) => e.stopPropagation()} style={{ width: '50px', padding: '4px', marginLeft: '5px', border: '1px solid #ccc', borderRadius: '3px' }} min="1" />
                        </label>
                      </div>
                    )}
                    <div style={{ marginTop: '5px', fontSize: '12px' }}>{isSelected ? '✓ Selected' : 'Click to select'}</div>
                  </button>
                );
              })}
            </div>
            {selectedCount > 0 && <div style={styles.summaryBar}><span style={{ color: t.textMuted }}>Selected: {selectedCount} template(s) • {selectedItemCount} total items</span></div>}}
            <div style={styles.actionButtons}>
              <button onClick={clearSelections} style={{ ...styles.btn, ...styles.btnSecondary }}>Clear All</button>
              <button onClick={selectAllTemplates} style={{ ...styles.btn, ...styles.btnSuccess }}>Select All</button>
              <button onClick={createList} disabled={selectedCount === 0} style={{ ...styles.btn, background: selectedCount === 0 ? t.disabled : '#007bff', color: 'white', cursor: selectedCount === 0 ? 'not-allowed' : 'pointer' }}>Create List</button>
            </div>
          </div>
        </div>
      )}

      {showItemDatabase && (
        <div style={styles.modal}>
          <div style={{ ...styles.modalContent, maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: `1px solid ${t.borderLight}` }}>
              <h2 style={{ margin: 0 }}>Item Database</h2>
              <button onClick={closeItemDatabase} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: t.textMuted }}>×</button>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <input type="text" value={databaseSearch} onChange={(e) => setDatabaseSearch(e.target.value)} placeholder="Search items..." style={{ ...styles.addFormInput, width: '100%' }} />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <button onClick={addDatabaseItem} style={{ ...styles.btn, ...styles.btnSuccess }}>+ Add New Item</button>
            </div>
            <div style={{ color: t.textMuted, marginBottom: '10px', fontSize: '14px' }}>Total: {itemDatabase.length} items</div>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: t.subtle, position: 'sticky', top: 0, zIndex: 1 }}>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: `2px solid ${t.border}`, background: t.subtle }}>Item Name</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: `2px solid ${t.border}`, background: t.subtle }}>Unit</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: `2px solid ${t.border}`, background: t.subtle }}>Type</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: `2px solid ${t.border}`, background: t.subtle }}>Brand</th>
                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: `2px solid ${t.border}`, background: t.subtle }}>Store</th>
                    <th style={{ padding: '10px', textAlign: 'center', borderBottom: `2px solid ${t.border}`, background: t.subtle }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {itemDatabase.filter(item =>
                    item.name.toLowerCase().includes(databaseSearch.toLowerCase()) ||
                    (item.brand || '').toLowerCase().includes(databaseSearch.toLowerCase()) ||
                    (item.store || '').toLowerCase().includes(databaseSearch.toLowerCase()) ||
                    (item.produceType || '').toLowerCase().includes(databaseSearch.toLowerCase())
                  ).sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
                    <tr key={item.id} style={{ borderBottom: `1px solid ${t.borderLight}` }}>
                      <td style={{ padding: '8px' }}><input type="text" value={item.name || ''} onChange={(e) => updateDatabaseItem(item.id, 'name', e.target.value)} style={{ ...styles.addFormInput, padding: '6px', fontWeight: '500' }} /></td>
                      <td style={{ padding: '8px' }}>
                        <select value={item.unit || ''} onChange={(e) => updateDatabaseItem(item.id, 'unit', e.target.value)} style={{ ...styles.addFormInput, padding: '6px' }}>
                          <option value="">Select unit...</option>
                          {UNITS.map(unit => <option key={unit} value={unit}>{unit}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '8px' }}>
                        <select value={item.produceType || ''} onChange={(e) => updateDatabaseItem(item.id, 'produceType', e.target.value)} style={{ ...styles.addFormInput, padding: '6px' }}>
                          <option value="">Select type...</option>
                          {PRODUCE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '8px' }}><input type="text" value={item.brand || ''} onChange={(e) => updateDatabaseItem(item.id, 'brand', e.target.value)} style={{ ...styles.addFormInput, padding: '6px' }} placeholder="-" /></td>
                      <td style={{ padding: '8px' }}><input type="text" value={item.store || ''} onChange={(e) => updateDatabaseItem(item.id, 'store', e.target.value)} style={{ ...styles.addFormInput, padding: '6px' }} placeholder="Store" /></td>
                      <td style={{ padding: '8px', textAlign: 'center' }}>
                        <button onClick={() => deleteDatabaseItem(item.id)} style={{ ...styles.btn, background: '#dc3545', color: '#fff', padding: '4px 8px', fontSize: '12px' }}>×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={styles.actionButtons}>
              <button onClick={closeItemDatabase} style={{ ...styles.btn, ...styles.btnSecondary }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {listToDelete && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '15px', borderBottom: `1px solid ${t.borderLight}` }}>
              <h2 style={{ margin: 0 }}>Delete List</h2>
              <button onClick={() => setListToDelete(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: t.textMuted }}>×</button>
            </div>
            <p style={{ color: t.textMuted, marginBottom: '20px' }}>Are you sure you want to delete this list? This cannot be undone.</p>
            <div style={styles.actionButtons}>
              <button onClick={() => setListToDelete(null)} style={{ ...styles.btn, ...styles.btnSecondary }}>Cancel</button>
              <button onClick={confirmDelete} style={{ ...styles.btn, background: '#dc3545', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}