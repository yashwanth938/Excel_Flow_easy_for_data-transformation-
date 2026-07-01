import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  Upload, Database, GitMerge, FileOutput, Key, 
  CopyX, Play, Settings, Plus, X, Search, 
  ArrowRight, FileSpreadsheet, FunctionSquare, Info,
  Filter, ArrowUpDown, RefreshCw, Trash2, Sliders,
  Hash, Split, Layers, Calendar, Sparkles, CheckCircle2,
  AlertTriangle, PlayCircle, Eye, HelpCircle, Download,
  ZoomIn, ZoomOut, Maximize2, Terminal, RefreshCcw, Check,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Trash, PlaySquare, EyeOff,
  Cpu, BookOpen, CheckCircle, Bot, Wand2, Copy, FileText, FileCode, CheckSquare,
  ArrowUp, ArrowDown, Save, FolderUp,
  Code, Code2, TrendingUp, Network, GitBranch, BrainCircuit,
  MapPin, Ruler, BarChart3, FileJson, FileType, Shuffle, AlignLeft, AlignRight,
  AlignStartVertical, AlignEndVertical, CircleDot, Navigation, Map, Columns,
  Binary, ShieldCheck, Percent, LayoutGrid, TreePine, Sigma, AlertOctagon, UserCheck
} from 'lucide-react';

const getColumnLetter = (colIndex) => {
  if (colIndex < 0) return 'A';
  let letter = '';
  let temp = colIndex;
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
};

const convertToCSV = (columns, data) => {
  if (!columns || !columns.length) return '';
  const headerRow = columns.map(c => `"${c.replace(/"/g, '""')}"`).join(',');
  const bodyRows = data.map(row => 
    columns.map(col => {
      const val = row[col] !== undefined && row[col] !== null ? String(row[col]) : '';
      return `"${val.replace(/"/g, '""')}"`;
    }).join(',')
  );
  return [headerRow, ...bodyRows].join('\n');
};

const MOCK_CUSTOMERS = {
  id: 'ds_customers',
  name: 'Customers_ERP.csv',
  sheetName: 'Sheet1',
  columns: ['CustomerID', 'CustomerName', 'Region', 'Segment', 'IsActive'],
  data: [
    { CustomerID: 'C001', CustomerName: 'Acme Corporate', Region: 'North', Segment: 'Enterprise', IsActive: 'Yes' },
    { CustomerID: 'C002', CustomerName: 'Globex Inc', Region: 'South', Segment: 'Mid-Market', IsActive: 'Yes' },
    { CustomerID: 'C003', CustomerName: 'Soylent Greens', Region: 'East', Segment: 'Enterprise', IsActive: 'No' },
    { CustomerID: 'C004', CustomerName: 'Initech Systems', Region: 'West', Segment: 'SMB', IsActive: 'Yes' },
    { CustomerID: 'C005', CustomerName: 'Umbrella Corp', Region: 'North', Segment: 'Enterprise', IsActive: 'Yes' },
    { CustomerID: 'C006', CustomerName: 'Hooli Tech', Region: 'West', Segment: 'Mid-Market', IsActive: 'No' }
  ]
};

const MOCK_ORDERS = {
  id: 'ds_orders',
  name: 'Sales_Orders.csv',
  sheetName: 'Sheet1',
  columns: ['OrderID', 'CustomerID', 'ProductItem', 'SalesAmount', 'OrderDate'],
  data: [
    { OrderID: 'TX-1001', CustomerID: 'C001', ProductItem: 'Cloud Server Base', SalesAmount: '2400', OrderDate: '2026-05-01' },
    { OrderID: 'TX-1002', CustomerID: 'C002', ProductItem: 'AI Database Core', SalesAmount: '1200', OrderDate: '2026-05-02' },
    { OrderID: 'TX-1003', CustomerID: 'C001', ProductItem: 'API Gateway License', SalesAmount: '350', OrderDate: '2026-05-03' },
    { OrderID: 'TX-1004', CustomerID: 'C005', ProductItem: 'Cyber Defense Pro', SalesAmount: '8500', OrderDate: '2026-05-04' },
    { OrderID: 'TX-1005', CustomerID: 'C002', ProductItem: 'AI Database Core', SalesAmount: '1200', OrderDate: '2026-05-02' }, 
    { OrderID: 'TX-1006', CustomerID: 'C009', ProductItem: 'Legacy Router v3', SalesAmount: '500', OrderDate: '2026-05-05' }  
  ]
};

const MOCK_PRODUCTS = {
  id: 'ds_products',
  name: 'Product_Catalog.xlsx',
  sheetName: 'Products',
  columns: ['ProductItem', 'Category', 'UnitPrice', 'SupplierCode'],
  data: [
    { ProductItem: 'Cloud Server Base', Category: 'Infrastructure', UnitPrice: '2400', SupplierCode: 'SUP-A' },
    { ProductItem: 'AI Database Core', Category: 'Intelligence', UnitPrice: '1200', SupplierCode: 'SUP-B' },
    { ProductItem: 'API Gateway License', Category: 'Infrastructure', UnitPrice: '350', SupplierCode: 'SUP-A' },
    { ProductItem: 'Cyber Defense Pro', Category: 'Security', UnitPrice: '8500', SupplierCode: 'SUP-C' },
    { ProductItem: 'Legacy Router v3', Category: 'Hardware', UnitPrice: '500', SupplierCode: 'SUP-D' }
  ]
};

const TOOL_CATEGORIES = {
  INPUT_OUTPUT: { name: 'In / Out', color: 'border-teal-700 text-teal-300 bg-teal-950/30' },
  PREPARATION: { name: 'Preparation', color: 'border-orange-700 text-orange-400 bg-orange-950/20' },
  JOIN_MATCH: { name: 'Join & Match', color: 'border-amber-700 text-amber-400 bg-amber-950/20' },
  PARSE: { name: 'Parse', color: 'border-cyan-700/50 text-cyan-400 bg-cyan-950/20' },
  TRANSFORM: { name: 'Transform', color: 'border-teal-600/40 text-teal-400 bg-teal-950/20' },
  REPORTING: { name: 'Reporting', color: 'border-emerald-700/50 text-emerald-400 bg-emerald-950/20' },
  SPATIAL: { name: 'Spatial', color: 'border-sky-700/50 text-sky-400 bg-sky-950/20' },
  VALIDATION: { name: 'Validation & Quality', color: 'border-red-900/40 text-red-400 bg-red-950/20' },
  DOCUMENTATION: { name: 'Documentation', color: 'border-slate-600/50 text-slate-400 bg-slate-900/40' },
  ANALYTICS: { name: 'Analytics', color: 'border-blue-700/60 text-blue-400 bg-blue-950/20' },
  MACHINE_LEARNING: { name: 'Machine Learning', color: 'border-purple-700/60 text-purple-400 bg-purple-950/20' },
  DATA_QUALITY: { name: 'Data Quality', color: 'border-pink-800/40 text-pink-400 bg-pink-950/20' }
};

const NODE_TYPES = {
  INPUT: { id: 'INPUT', name: 'File Input', category: 'INPUT_OUTPUT', icon: Database, color: 'bg-teal-950/80 border-teal-600 text-teal-100 hover:border-teal-400', inputs: 0, outputs: 1 },
  OUTPUT: { id: 'OUTPUT', name: 'Output Data', category: 'INPUT_OUTPUT', icon: FileOutput, color: 'bg-[#082f25] border-emerald-600 text-emerald-100 hover:border-emerald-400', inputs: 1, outputs: 0 },
  
  SELECT: { id: 'SELECT', name: 'Select Fields', category: 'PREPARATION', icon: Sliders, color: 'bg-orange-950/70 border-orange-600 text-orange-100 hover:border-orange-400', inputs: 1, outputs: 1 },
  FILTER: { id: 'FILTER', name: 'Filter Rows', category: 'PREPARATION', icon: Filter, color: 'bg-[#032328] border-cyan-600 text-cyan-200 hover:border-cyan-400', inputs: 1, outputs: 1 },
  SORT: { id: 'SORT', name: 'Sort Fields', category: 'PREPARATION', icon: ArrowUpDown, color: 'bg-orange-950/70 border-orange-600 text-orange-100 hover:border-orange-400', inputs: 1, outputs: 1 },
  FORMULA: { id: 'FORMULA', name: 'Formula Tool', category: 'PREPARATION', icon: FunctionSquare, color: 'bg-orange-950/80 border-orange-500 text-orange-100 hover:border-orange-400', inputs: 1, outputs: 1 },
  CONCAT: { id: 'CONCAT', name: 'Concatenate Tool', category: 'PREPARATION', icon: GitMerge, color: 'bg-orange-950/80 border-orange-500 text-orange-100 hover:border-orange-400', inputs: 1, outputs: 1 },
  CLEANSE: { id: 'CLEANSE', name: 'Data Cleansing', category: 'PREPARATION', icon: Sparkles, color: 'bg-orange-950/80 border-orange-500 text-orange-100 hover:border-orange-400', inputs: 1, outputs: 1 },
  TEXTSPLIT: { id: 'TEXTSPLIT', name: 'Text to Columns', category: 'PREPARATION', icon: Split, color: 'bg-orange-950/80 border-orange-500 text-orange-100 hover:border-orange-400', inputs: 1, outputs: 1 },
  UNIQUE: { id: 'UNIQUE', name: 'Unique (Dedupe)', category: 'PREPARATION', icon: CopyX, color: 'bg-orange-950/80 border-orange-500 text-orange-100 hover:border-orange-400', inputs: 1, outputs: 1 },
  UID: { id: 'UID', name: 'Unique ID Tool', category: 'PREPARATION', icon: Key, color: 'bg-orange-950/90 border-orange-550 text-orange-200 hover:border-orange-400', inputs: 1, outputs: 1 },

  JOIN: { id: 'JOIN', name: 'Join (Visual Merge)', category: 'JOIN_MATCH', icon: GitMerge, color: 'bg-amber-950/80 border-amber-600 text-amber-100 hover:border-amber-400', inputs: 2, outputs: 1 },
  LOOKUP: { id: 'LOOKUP', name: 'XLOOKUP Tool', category: 'JOIN_MATCH', icon: Search, color: 'bg-amber-950/80 border-amber-500 text-amber-100 hover:border-amber-400', inputs: 2, outputs: 1 },
  UNION: { id: 'UNION', name: 'Union Tools', category: 'JOIN_MATCH', icon: Layers, color: 'bg-amber-950/80 border-amber-500 text-amber-100 hover:border-amber-400', inputs: 2, outputs: 1 },

  SUMMARIZE: { id: 'SUMMARIZE', name: 'Summarize Tool', category: 'TRANSFORM', icon: Hash, color: 'bg-teal-950/40 border-teal-600 text-teal-100 hover:border-teal-400', inputs: 1, outputs: 1 },

  NULL_CHECK: { id: 'NULL_CHECK', name: 'Null Detection', category: 'VALIDATION', icon: AlertTriangle, color: 'bg-red-950/80 border-red-700 text-red-200 hover:border-red-400', inputs: 1, outputs: 1 },
  BROWSE: { id: 'BROWSE', name: 'Browse Tool', category: 'VALIDATION', icon: Eye, color: 'bg-red-950/80 border-red-700 text-red-200 hover:border-red-400', inputs: 1, outputs: 1 },
  UNIQUE_CONSTRAINT: { id: 'UNIQUE_CONSTRAINT', name: 'Unique Constraint', category: 'VALIDATION', icon: AlertOctagon, color: 'bg-red-950/80 border-red-700 text-red-200 hover:border-red-400', inputs: 1, outputs: 1 },

  SAMPLE: { id: 'SAMPLE', name: 'Sample', category: 'PREPARATION', icon: Filter, color: 'bg-orange-950/80 border-orange-500 text-orange-100 hover:border-orange-400', inputs: 1, outputs: 1 },
  FIND_REPLACE: { id: 'FIND_REPLACE', name: 'Find Replace', category: 'JOIN_MATCH', icon: Search, color: 'bg-amber-950/80 border-amber-500 text-amber-100 hover:border-amber-400', inputs: 2, outputs: 1 },
  REGEX: { id: 'REGEX', name: 'Regex', category: 'PARSE', icon: Terminal, color: 'bg-cyan-950/40 border-cyan-600 text-cyan-200 hover:border-cyan-400', inputs: 1, outputs: 1 },
  TEXT_TO_COLUMNS: { id: 'TEXT_TO_COLUMNS', name: 'Text To Columns', category: 'PARSE', icon: Split, color: 'bg-cyan-950/40 border-cyan-600 text-cyan-200 hover:border-cyan-400', inputs: 1, outputs: 1 },

  APPEND: { id: 'APPEND', name: 'Append Fields', category: 'JOIN_MATCH', icon: Layers, color: 'bg-amber-950/80 border-amber-500 text-amber-100 hover:border-amber-400', inputs: 2, outputs: 1 },

  MULTI_ROW: { id: 'MULTI_ROW', name: 'Multi-Row Formula', category: 'TRANSFORM', icon: ArrowUpDown, color: 'bg-teal-950/40 border-teal-600 text-teal-100 hover:border-teal-400', inputs: 1, outputs: 1 },
  TRANSPOSE: { id: 'TRANSPOSE', name: 'Transpose', category: 'TRANSFORM', icon: RefreshCw, color: 'bg-teal-950/40 border-teal-600 text-teal-100 hover:border-teal-400', inputs: 1, outputs: 1 },
  CROSSTAB: { id: 'CROSSTAB', name: 'Cross Tab', category: 'TRANSFORM', icon: RefreshCcw, color: 'bg-teal-950/40 border-teal-600 text-teal-100 hover:border-teal-400', inputs: 1, outputs: 1 },

  COMMENT: { id: 'COMMENT', name: 'Comment', category: 'DOCUMENTATION', icon: FileText, color: 'bg-slate-800 border-slate-600 text-slate-200 hover:border-slate-400', inputs: 0, outputs: 0 },

  PYTHON: { id: 'PYTHON', name: 'Python Tool', category: 'ANALYTICS', icon: Code, color: 'bg-blue-950/40 border-blue-600 text-blue-200 hover:border-blue-400', inputs: 1, outputs: 1 },
  R_TOOL: { id: 'R_TOOL', name: 'R Tool', category: 'ANALYTICS', icon: Code2, color: 'bg-blue-950/40 border-blue-600 text-blue-200 hover:border-blue-400', inputs: 1, outputs: 1 },

  LINEAR_REGRESSION: { id: 'LINEAR_REGRESSION', name: 'Linear Regression', category: 'MACHINE_LEARNING', icon: TrendingUp, color: 'bg-purple-950/40 border-purple-600 text-purple-200 hover:border-purple-400', inputs: 1, outputs: 1 },
  CLUSTER: { id: 'CLUSTER', name: 'Cluster Tool', category: 'MACHINE_LEARNING', icon: Network, color: 'bg-purple-950/40 border-purple-600 text-purple-200 hover:border-purple-400', inputs: 1, outputs: 1 },
  DECISION_TREE: { id: 'DECISION_TREE', name: 'Decision Tree', category: 'MACHINE_LEARNING', icon: GitBranch, color: 'bg-purple-950/40 border-purple-600 text-purple-200 hover:border-purple-400', inputs: 1, outputs: 1 },
  NEURAL_NETWORK: { id: 'NEURAL_NETWORK', name: 'Neural Network', category: 'MACHINE_LEARNING', icon: BrainCircuit, color: 'bg-purple-950/40 border-purple-600 text-purple-200 hover:border-purple-400', inputs: 1, outputs: 1 },

  DUPLICATE_DETECTION: { id: 'DUPLICATE_DETECTION', name: 'Duplicate Detection', category: 'DATA_QUALITY', icon: CopyX, color: 'bg-pink-950/40 border-pink-700 text-pink-200 hover:border-pink-500', inputs: 1, outputs: 1 },
  ADVANCED_NULL_ANALYSIS: { id: 'ADVANCED_NULL_ANALYSIS', name: 'Null Analysis', category: 'DATA_QUALITY', icon: AlertTriangle, color: 'bg-pink-950/40 border-pink-700 text-pink-200 hover:border-pink-500', inputs: 1, outputs: 1 },

  AUTO_FIELD: { id: 'AUTO_FIELD', name: 'Auto Field', category: 'PREPARATION', icon: FileType, color: 'bg-orange-950/80 border-orange-500 text-orange-100 hover:border-orange-400', inputs: 1, outputs: 1 },
  FIELD_INFO: { id: 'FIELD_INFO', name: 'Field Info', category: 'PREPARATION', icon: Info, color: 'bg-orange-950/80 border-orange-500 text-orange-100 hover:border-orange-400', inputs: 1, outputs: 1 },

  FUZZY_MATCH: { id: 'FUZZY_MATCH', name: 'Fuzzy Match', category: 'JOIN_MATCH', icon: Shuffle, color: 'bg-amber-950/80 border-amber-500 text-amber-100 hover:border-amber-400', inputs: 2, outputs: 1 },
  JOIN_MULTIPLE: { id: 'JOIN_MULTIPLE', name: 'Join Multiple', category: 'JOIN_MATCH', icon: Columns, color: 'bg-amber-950/80 border-amber-500 text-amber-100 hover:border-amber-400', inputs: 2, outputs: 1 },
  MATCH_RECONCILIATION: { id: 'MATCH_RECONCILIATION', name: 'Match & Recon', category: 'JOIN_MATCH', icon: ShieldCheck, color: 'bg-amber-950/80 border-amber-500 text-amber-100 hover:border-amber-400', inputs: 2, outputs: 1 },
  SMART_MATCH: { id: 'SMART_MATCH', name: 'Smart Match', category: 'JOIN_MATCH', icon: UserCheck, color: 'bg-amber-950/85 border-amber-600 text-amber-100 hover:border-amber-400', inputs: 2, outputs: 1 },

  XML_PARSE: { id: 'XML_PARSE', name: 'XML Parse', category: 'PARSE', icon: FileCode, color: 'bg-cyan-950/40 border-cyan-600 text-cyan-200 hover:border-cyan-400', inputs: 1, outputs: 1 },
  JSON_PARSE: { id: 'JSON_PARSE', name: 'JSON Parse', category: 'PARSE', icon: FileJson, color: 'bg-cyan-950/40 border-cyan-600 text-cyan-200 hover:border-cyan-400', inputs: 1, outputs: 1 },
  DYNAMIC_RENAME: { id: 'DYNAMIC_RENAME', name: 'Dynamic Rename', category: 'PARSE', icon: FileType, color: 'bg-cyan-950/40 border-cyan-600 text-cyan-200 hover:border-cyan-400', inputs: 1, outputs: 1 },

  RUNNING_TOTAL: { id: 'RUNNING_TOTAL', name: 'Running Total', category: 'TRANSFORM', icon: Sigma, color: 'bg-teal-950/40 border-teal-600 text-teal-100 hover:border-teal-400', inputs: 1, outputs: 1 },
  TILE: { id: 'TILE', name: 'Tile', category: 'TRANSFORM', icon: LayoutGrid, color: 'bg-teal-950/40 border-teal-600 text-teal-100 hover:border-teal-400', inputs: 1, outputs: 1 },
  VOLUME_INCREMENT_MAPPING: { id: 'VOLUME_INCREMENT_MAPPING', name: 'Volume & Increment', category: 'TRANSFORM', icon: Percent, color: 'bg-teal-950/45 border-teal-600 text-teal-100 hover:border-teal-400', inputs: 1, outputs: 1 },

  CHARTING: { id: 'CHARTING', name: 'Chart Tool', category: 'REPORTING', icon: BarChart3, color: 'bg-emerald-950/40 border-emerald-600 text-emerald-200 hover:border-emerald-400', inputs: 1, outputs: 1 },
  REPORT_TEXT: { id: 'REPORT_TEXT', name: 'Report Text', category: 'REPORTING', icon: FileText, color: 'bg-emerald-950/40 border-emerald-600 text-emerald-200 hover:border-emerald-400', inputs: 1, outputs: 1 },

  SPATIAL_POINT: { id: 'SPATIAL_POINT', name: 'Create Points', category: 'SPATIAL', icon: MapPin, color: 'bg-sky-950/40 border-sky-600 text-sky-200 hover:border-sky-400', inputs: 1, outputs: 1 },
  DISTANCE_CALC: { id: 'DISTANCE_CALC', name: 'Distance', category: 'SPATIAL', icon: Ruler, color: 'bg-sky-950/40 border-sky-600 text-sky-200 hover:border-sky-400', inputs: 1, outputs: 1 },
  SPATIAL_MATCH: { id: 'SPATIAL_MATCH', name: 'Spatial Match', category: 'SPATIAL', icon: Navigation, color: 'bg-sky-950/40 border-sky-600 text-sky-200 hover:border-sky-400', inputs: 2, outputs: 1 },
  BUFFER: { id: 'BUFFER', name: 'Buffer', category: 'SPATIAL', icon: CircleDot, color: 'bg-sky-950/40 border-sky-600 text-sky-200 hover:border-sky-400', inputs: 1, outputs: 1 },
  AREA_CALC: { id: 'AREA_CALC', name: 'Area Calculation', category: 'SPATIAL', icon: Map, color: 'bg-sky-950/40 border-sky-600 text-sky-200 hover:border-sky-400', inputs: 1, outputs: 1 },

  LOGISTIC_REGRESSION: { id: 'LOGISTIC_REGRESSION', name: 'Logistic Regression', category: 'MACHINE_LEARNING', icon: Binary, color: 'bg-purple-950/40 border-purple-600 text-purple-200 hover:border-purple-400', inputs: 1, outputs: 1 },
  RANDOM_FOREST: { id: 'RANDOM_FOREST', name: 'Random Forest', category: 'MACHINE_LEARNING', icon: TreePine, color: 'bg-purple-950/40 border-purple-600 text-purple-200 hover:border-purple-400', inputs: 1, outputs: 1 },
  SSN_FORMAT: { id: 'SSN_FORMAT', name: 'SSN Format', category: 'PARSE', icon: FileType, color: 'bg-cyan-950/40 border-cyan-600 text-cyan-200 hover:border-cyan-400', inputs: 1, outputs: 1 },
  REMOVE_DUPLICATES: { id: 'REMOVE_DUPLICATES', name: 'Remove Duplicates', category: 'DATA_QUALITY', icon: CopyX, color: 'bg-pink-950/40 border-pink-700 text-pink-200 hover:border-pink-500', inputs: 1, outputs: 1 },
  ARRANGE_COLUMNS: { id: 'ARRANGE_COLUMNS', name: 'Arrange Columns', category: 'PREPARATION', icon: ArrowUpDown, color: 'bg-orange-950/80 border-orange-500 text-orange-100 hover:border-orange-400', inputs: 1, outputs: 1 },
  COPY_COLUMNS: { id: 'COPY_COLUMNS', name: 'Copy Columns', category: 'PREPARATION', icon: Copy, color: 'bg-orange-950/80 border-orange-500 text-orange-100 hover:border-orange-400', inputs: 1, outputs: 1 },
  TEXT_INPUT: { id: 'TEXT_INPUT', name: 'Text Input', category: 'INPUT_OUTPUT', icon: AlignLeft, color: 'bg-teal-950/80 border-teal-600 text-teal-100 hover:border-teal-400', inputs: 0, outputs: 1 }
};

const FORMULA_HELP_DATABASE = [
  {
    id: 'XLOOKUP',
    name: 'XLOOKUP',
    category: 'LOOKUP',
    syntax: 'XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])',
    description: 'Searches a range or an array, and then returns the item corresponding to the first match.',
    example: 'XLOOKUP([CustomerID], Sheet2![CustomerID], Sheet2![CustomerName], "Unknown")',
    useCase: 'Retrieving clean metadata across transactional boundaries.'
  },
  {
    id: 'UPPER',
    name: 'UPPER',
    category: 'TEXT',
    syntax: 'UPPER(text)',
    description: 'Converts all letters in a text string to uppercase.',
    example: 'UPPER([ProductItem])',
    useCase: 'Standardizing raw character encodings.'
  },
  {
    id: 'TRIM',
    name: 'TRIM',
    category: 'TEXT',
    syntax: 'TRIM(text)',
    description: 'Removes all spaces from text except for single spaces between words.',
    example: 'TRIM([CustomerName])',
    useCase: 'Clearing rogue leading/trailing whitespaces.'
  },
  {
    id: 'CONCAT',
    name: 'CONCAT',
    category: 'TEXT',
    syntax: 'CONCAT(text1, text2, ...)',
    description: 'Combines the text from multiple ranges and/or strings.',
    example: 'CONCAT([CustomerID], "_", [Region])',
    useCase: 'Constructing robust multi-field Composite Keys.'
  },
  {
    id: 'IF',
    name: 'IF',
    category: 'CONDITIONAL',
    syntax: 'IF(logical_test, value_if_true, value_if_false)',
    description: 'Returns one value if a condition is true and another value if it is false.',
    example: 'IF([SalesAmount] > 1000, "Enterprise", "Retail")',
    useCase: 'Segmenting database transaction tiers dynamically.'
  }
];

const getLiveFormulaRepresentation = (node, upstreamCols = []) => {
  if (!node) return '=A1';
  const config = node.config || {};
  switch (node.type) {
    case 'INPUT':
      return `='[${config.dataset?.name || "Sheet"}]'!A1:Z100`;
    case 'SELECT': {
      const selCols = config.selectedColumns || [];
      return `=CHOOSECOLS(SheetRef!A:Z, ${selCols.map(c => `MATCH("${c}", Headers, 0)`).join(', ') || 'All'})`;
    }
    case 'FILTER': {
      const operatorSymbol = config.operator === '==' ? '=' : config.operator === '!=' ? '<>' : config.operator || '=';
      return `=FILTER(A2:Z100, [${config.column || 'Field'}] ${operatorSymbol} "${config.value || ''}")`;
    }
    case 'SORT':
      return `=SORT(A2:Z100, MATCH("${config.column || 'Field'}", Headers, 0), ${config.direction === 'DESC' ? '-1' : '1'})`;
    case 'FORMULA':
      return config.customFormula ? (config.customFormula.startsWith('=') ? config.customFormula : '=' + config.customFormula) : '=[Field]*1.1';
    case 'CONCAT': {
      const fields = config.selectedFields || [];
      const sepType = config.separator || 'space';
      let sepChar = ' ';
      if (sepType === 'dash') sepChar = '-';
      else if (sepType === 'underscore') sepChar = '_';
      else if (sepType === 'custom') sepChar = config.customSeparator || '';
      
      const partsFormulas = fields.map(f => {
        const idx = upstreamCols.indexOf(f);
        return idx >= 0 ? `${getColumnLetter(idx)}2` : `[${f}]`;
      });
      
      let baseFormula = `TEXTJOIN("${sepChar}", ${config.ignoreBlank !== false ? 'TRUE' : 'FALSE'}, ${partsFormulas.join(', ') || '""'})`;
      if (config.trimSpaces !== false) {
        baseFormula = `TRIM(${baseFormula})`;
      }
      if (config.caseConversion === 'upper') {
        baseFormula = `UPPER(${baseFormula})`;
      } else if (config.caseConversion === 'lower') {
        baseFormula = `LOWER(${baseFormula})`;
      }
      
      let wrapped = baseFormula;
      if (config.prefix || config.suffix) {
        wrapped = `${config.prefix ? `"${config.prefix}" & ` : ''}${baseFormula}${config.suffix ? ` & "${config.suffix}"` : ''}`;
      }
      return `=${wrapped}`;
    }
    case 'CLEANSE':
      return `=TRIM(${config.column || 'Field'}2)`;
    case 'TEXTSPLIT': {
      if (config.mode === 'increment') {
        const customText = config.customText !== undefined ? config.customText : 'TXT';
        const padding = Number(config.padding) || 0;
        const startIndex = Number(config.startingIndex) || 1;
        const step = Number(config.step) || 1;
        const zeros = padding > 0 ? "0".repeat(padding) : "General";
        return `="${customText}" & TEXT(ROW(A2) - 2 + ${startIndex} * ${step}, "${zeros}")`;
      }
      return `=TEXTSPLIT(${config.column || 'Field'}2, "${config.delimiter || '-'}")`;
    }
    case 'UNIQUE':
      return `=UNIQUE(A2:Z100)`;
    case 'UID': {
      const prefix = config.prefix !== undefined ? config.prefix : '';
      const suffix = config.suffix !== undefined ? config.suffix : '';
      const separator = config.separator !== undefined ? config.separator : '_';
      const fields = config.selectedFields || [];
      
      if (fields.length === 0) return `="${prefix}" & "${suffix}"`;
      
      const partsFormulas = fields.map(f => {
        const idx = upstreamCols.indexOf(f);
        return idx >= 0 ? `${getColumnLetter(idx)}2` : `[${f}]`;
      });
      
      let excelFormula = `TEXTJOIN("${separator}", TRUE, ${partsFormulas.join(', ')})`;
      if (prefix && suffix) {
        excelFormula = `="${prefix}" & ${excelFormula} & "${suffix}"`;
      } else if (prefix) {
        excelFormula = `="${prefix}" & ${excelFormula}`;
      } else if (suffix) {
        excelFormula = `${excelFormula} & "${suffix}"`;
      } else {
        excelFormula = `=${excelFormula}`;
      }
      if (!excelFormula.startsWith('=')) excelFormula = '=' + excelFormula;
      return excelFormula;
    }
    case 'JOIN':
      return `=LET(Match, MATCH(${config.leftKey || 'Key'}, RightTable!${config.rightKey || 'Key'}, 0), INDEX(RightTable, Match, ColIndex))`;
    case 'LOOKUP':
      return `=XLOOKUP(${config.baseKey || 'Key'}2, Sheet2!${config.lookupKey || 'Key'}, Sheet2!${config.returnCol || 'Value'}, "${config.notFoundText || '#N/A'}")`;
    case 'UNION':
      return `=VSTACK(Table1, Table2)`;
    case 'SUMMARIZE':
      return `=SUMIFS(${config.aggCol || 'Value'}, ${config.groupBy || 'Group'}, A2)`;
    case 'RUNNING_TOTAL':
      return `=SUM($A$2:A2)`;
    case 'NULL_CHECK':
      return `=ISBLANK(${config.column || 'Field'}2)`;
    case 'OUTPUT':
      return `='[Export]Sheet1'!A1`;
    default:
      return '=A1';
  }
};

const getBezierPath = (from, to) => {
  const dx = to.x - from.x;
  const hOffset = Math.max(Math.abs(dx) * 0.5, 40);
  return `M ${from.x} ${from.y} C ${from.x + hOffset} ${from.y}, ${to.x - hOffset} ${to.y}, ${to.x} ${to.y}`;
};

const globalWorker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
const workerResolvers = {};

globalWorker.onmessage = (e) => {
  const { id, result, error } = e.data;
  if (id in workerResolvers) {
    const { resolve, reject, timeoutId } = workerResolvers[id];
    clearTimeout(timeoutId);
    delete workerResolvers[id];
    if (error) reject(new Error(error));
    else resolve(result);
  }
};
globalWorker.onerror = (e) => {
  console.error("Global Worker Error:", e.message);
  for (const id in workerResolvers) {
    const { reject, timeoutId } = workerResolvers[id];
    clearTimeout(timeoutId);
    reject(new Error(`Worker thread crashed fatally: ${e.message}`));
    delete workerResolvers[id];
  }
};

const evaluateNodeWithWorker = (node, inputDataArray) => {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString(36).substring(7);
    
    // Set a timeout to prevent infinite hangs (softlocks) if worker gets stuck
    const timeoutId = setTimeout(() => {
      if (workerResolvers[id]) {
        delete workerResolvers[id];
        reject(new Error(`Node [${node.type}] execution timed out after 120 seconds.`));
      }
    }, 120000); // 2 minute timeout

    workerResolvers[id] = { resolve, reject, timeoutId };
    
    try {
      globalWorker.postMessage({ id, node, inputDataArray });
    } catch (err) {
      clearTimeout(timeoutId);
      delete workerResolvers[id];
      reject(new Error(`Failed to send data to worker (possible DataCloneError): ${err.message}`));
    }
  });
};

const VirtualTable = ({ data, columns }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);
  const rowHeight = 30;
  const [viewportHeight, setViewportHeight] = useState(300);

  useEffect(() => {
    if (containerRef.current) {
      setViewportHeight(containerRef.current.offsetHeight || 300);
      const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          setViewportHeight(entry.contentRect.height);
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const handleScroll = (e) => {
    setScrollTop(e.target.scrollTop);
  };

  const columnStats = useMemo(() => {
    const stats = {};
    columns.forEach(col => {
      let populated = 0;
      let nulls = 0;
      let types = new Set();
      
      data.forEach(row => {
        const val = row[col];
        if (val === undefined || val === null || String(val).trim() === '') {
          nulls++;
        } else {
          populated++;
          const num = Number(val);
          if (!isNaN(num) && String(val).trim() !== '') {
            types.add('Number');
          } else if (!isNaN(Date.parse(val)) && String(val).length > 5) {
            types.add('Date');
          } else if (val === 'true' || val === 'false' || typeof val === 'boolean') {
            types.add('Boolean');
          } else {
            types.add('Text');
          }
        }
      });

      let type = 'Text';
      if (types.size === 1) {
        type = Array.from(types)[0];
      } else if (types.size > 1) {
        if (types.has('Text')) type = 'Text';
        else if (types.has('Date')) type = 'Date';
        else if (types.has('Number')) type = 'Number';
      }
      
      stats[col] = {
        type,
        populated,
        nulls
      };
    });
    return stats;
  }, [data, columns]);

  const totalHeight = data.length * rowHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - 2);
  const visibleItems = Math.ceil(viewportHeight / rowHeight) + 4;
  const endIndex = Math.min(startIndex + visibleItems, data.length);
  const visibleData = data.slice(startIndex, endIndex);
  const offsetY = startIndex * rowHeight;

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll} 
      className="flex-1 overflow-auto bg-[#050e10] p-0 custom-scrollbar relative"
      style={{ height: '100%' }}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        <table className="w-full text-left border-collapse text-xs whitespace-nowrap" style={{ transform: `translateY(${offsetY}px)`, position: 'absolute', top: 0, left: 0 }}>
          <thead className="bg-[#06191c] text-teal-400 shadow z-10 sticky top-0" style={{ position: 'sticky', top: 0 }}>
            <tr>
              {columns.map((col, idx) => {
                const stats = columnStats[col];
                return (
                  <th key={idx} className="py-2.5 px-4 border-b border-teal-950 font-bold tracking-wider text-[10px] uppercase text-teal-100 bg-[#06191c] min-w-[120px] align-top">
                    <div className="truncate mb-1" title={col}>{col}</div>
                    <div className="text-[8px] text-orange-500 font-mono font-normal">Col: {getColumnLetter(idx)}</div>
                    {stats && (
                      <div className="mt-1.5 pt-1.5 border-t border-teal-950/40 text-left normal-case font-normal">
                        <span className="text-[9px] text-teal-400 block font-sans font-semibold">({stats.type})</span>
                        <span className="text-[9px] text-teal-300/60 block font-sans">Values: {stats.populated.toLocaleString()}</span>
                        <span className={`text-[9px] block font-sans ${stats.nulls > 0 ? 'text-orange-400 font-medium' : 'text-teal-300/40'}`}>
                          Nulls: {stats.nulls.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-teal-950/60 bg-[#050e10]">
            {visibleData.map((row, rIdx) => (
              <tr key={startIndex + rIdx} className="hover:bg-teal-950/25 bg-[#050e10]/40 transition-colors" style={{ height: `${rowHeight}px` }}>
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className="py-1.5 px-4 text-teal-200 font-mono text-[11px] truncate max-w-[200px]" title={row[col] !== undefined && row[col] !== null ? String(row[col]) : ''}>
                    {row[col] !== undefined && row[col] !== null ? String(row[col]) : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OutputFieldConfig = ({ node, updateNodeConfig, upstreamCols = [] }) => {
  const action = node.config.outputAction || 'create';
  
  useEffect(() => {
    if (action === 'create' && node.config.outputColumnName === undefined) {
      const defaultName = `${node.type.charAt(0)}${node.type.slice(1).toLowerCase()}_Result`;
      updateNodeConfig(node.id, 'outputColumnName', defaultName);
    }
  }, [action, node.config.outputColumnName, node.id, node.type, updateNodeConfig]);

  const currentOutName = node.config.outputColumnName || '';
  const isDuplicate = action === 'create' && currentOutName && upstreamCols.includes(currentOutName);

  return (
    <div className="mt-4 p-3 bg-[#06191c] border border-teal-900 rounded-lg space-y-3">
      <h4 className="text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-2 border-b border-teal-900/50 pb-1 flex items-center gap-1.5">
        <Sliders className="w-3 h-3" /> Output Field Configuration
      </h4>
      
      <div className="flex gap-4 mb-2 text-[11px] text-teal-200">
        <label className="flex items-center gap-1.5 cursor-pointer hover:text-teal-100">
          <input 
            type="radio" 
            name={`outputAction_${node.id}`} 
            value="create" 
            checked={action === 'create'} 
            onChange={(e) => updateNodeConfig(node.id, 'outputAction', e.target.value)}
            className="accent-teal-500"
          />
          Create New Column
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer hover:text-teal-100">
          <input 
            type="radio" 
            name={`outputAction_${node.id}`} 
            value="replace" 
            checked={action === 'replace'} 
            onChange={(e) => updateNodeConfig(node.id, 'outputAction', e.target.value)}
            className="accent-teal-500"
          />
          Replace Existing
        </label>
      </div>

      {action === 'create' ? (
        <div className="space-y-1">
          <label className="block text-[9px] text-teal-500 uppercase font-bold">Output Column Name</label>
          <input 
            type="text"
            placeholder="e.g. Result_Field"
            value={currentOutName}
            onChange={(e) => updateNodeConfig(node.id, 'outputColumnName', e.target.value)}
            className={`w-full bg-[#031114] border ${isDuplicate ? 'border-red-500' : 'border-teal-950'} rounded px-2 py-1.5 text-xs text-teal-100 focus:outline-none focus:border-teal-500 transition-colors`}
          />
          {isDuplicate && (
            <div className="text-[9px] text-red-400 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Warning: A column with this name already exists. It will be overwritten.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          <label className="block text-[9px] text-teal-500 uppercase font-bold">Select Column to Replace</label>
          <select
            value={node.config.targetColumn || ''}
            onChange={(e) => updateNodeConfig(node.id, 'targetColumn', e.target.value)}
            className="w-full bg-[#031114] border border-teal-950 rounded px-2 py-1.5 text-xs text-teal-100 focus:outline-none focus:border-teal-500 transition-colors"
          >
            <option value="">-- Choose Column --</option>
            {upstreamCols.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-[9px] text-teal-500 uppercase font-bold">Data Type</label>
        <select
          value={node.config.outputDataType || 'Auto'}
          onChange={(e) => updateNodeConfig(node.id, 'outputDataType', e.target.value)}
          className="w-full bg-[#031114] border border-teal-950 rounded px-2 py-1.5 text-xs text-teal-100 focus:outline-none focus:border-teal-500 transition-colors"
        >
          <option value="Auto">Auto Detect</option>
          <option value="String">String (Text)</option>
          <option value="Number">Number (Double)</option>
          <option value="Boolean">Boolean</option>
          <option value="Date">Date</option>
        </select>
      </div>
    </div>
  );
};

const WorkflowChart = ({ chartData }) => {
  if (!chartData || !chartData.labels || !chartData.values) return null;
  const { type, labels, values } = chartData;
  
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  
  if (type === 'bar') {
    return (
      <div className="p-3 bg-[#050e10] border border-teal-950 rounded-lg space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar">
        {labels.map((lbl, idx) => {
          const val = values[idx];
          const pct = Math.max(2, Math.min(100, (val / maxVal) * 100));
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[10px] text-teal-400 font-mono">
                <span className="truncate max-w-[150px]">{lbl || `Item ${idx+1}`}</span>
                <span>{val}</span>
              </div>
              <div className="w-full bg-teal-950/40 h-3 rounded overflow-hidden border border-teal-900/40">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-orange-500 h-full rounded transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  
  if (type === 'pie') {
    let accum = 0;
    const total = values.reduce((a, b) => a + b, 0) || 1;
    const slices = labels.map((lbl, idx) => {
      const val = values[idx];
      const start = (accum / total) * 360;
      const deg = (val / total) * 360;
      accum += val;
      const colors = ['#0d9488', '#f97316', '#3b82f6', '#a855f7', '#ec4899', '#eab308', '#10b981'];
      return {
        label: lbl,
        value: val,
        percentage: ((val / total) * 100).toFixed(1),
        color: colors[idx % colors.length],
        start,
        deg
      };
    });
    
    const conicGradientParts = slices.map(s => `${s.color} ${s.start}deg ${(s.start + s.deg)}deg`);
    const conicStyle = {
      background: `conic-gradient(${conicGradientParts.join(', ')})`
    };
    
    return (
      <div className="p-3 bg-[#050e10] border border-teal-950 rounded-lg flex flex-col items-center gap-3">
        <div className="w-24 h-24 rounded-full border border-teal-900/60 shadow-lg relative" style={conicStyle}>
          <div className="absolute inset-6 bg-[#050e10] rounded-full border border-teal-950 flex items-center justify-center">
            <span className="text-[9px] text-teal-500 font-mono">Total: {total}</span>
          </div>
        </div>
        <div className="w-full text-[9px] text-teal-400 font-mono grid grid-cols-2 gap-2 max-h-[120px] overflow-y-auto custom-scrollbar">
          {slices.map((s, idx) => (
            <div key={idx} className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              <span className="truncate max-w-[80px]">{s.label}:</span>
              <span className="text-orange-400 font-bold">{s.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  const width = 280;
  const height = 150;
  const padding = 25;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;
  
  const points = values.map((val, idx) => {
    const x = padding + (idx / Math.max(1, values.length - 1)) * chartW;
    const range = maxVal - minVal || 1;
    const y = padding + chartH - ((val - minVal) / range) * chartH;
    return { x, y, val, label: labels[idx] };
  });
  
  const pathData = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  
  return (
    <div className="p-3 bg-[#050e10] border border-teal-950 rounded-lg space-y-2">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
          const y = padding + chartH * p;
          const labelVal = (maxVal - p * (maxVal - minVal)).toFixed(1);
          return (
            <g key={i} className="opacity-30">
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#115e59" strokeWidth="0.5" strokeDasharray="2,2" />
              <text x={padding - 5} y={y + 3} fill="#0d9488" fontSize="6" textAnchor="end" className="font-mono">{labelVal}</text>
            </g>
          );
        })}
        
        {type === 'line' && points.length > 0 && (
          <>
            <path d={pathData} fill="none" stroke="url(#lineGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>
            </defs>
          </>
        )}
        
        {points.map((p, idx) => (
          <g key={idx}>
            <circle 
              cx={p.x} 
              cy={p.y} 
              r={type === 'scatter' ? "3" : "2"} 
              fill={type === 'scatter' ? "#f97316" : "#0d9488"} 
              stroke="#06191c" 
              strokeWidth="0.5"
              className="hover:r-4 transition-all duration-150 cursor-pointer"
            >
              <title>{`${p.label}: ${p.val}`}</title>
            </circle>
          </g>
        ))}
      </svg>
      <div className="flex justify-between text-[8px] text-teal-600 font-mono px-2">
        <span>{labels[0] || 'Start'}</span>
        <span>{labels[labels.length - 1] || 'End'}</span>
      </div>
    </div>
  );
};

export default function App() {
  const [sheetjsLoaded, setSheetjsLoaded] = useState(false);
  const [datasets, setDatasets] = useState([MOCK_CUSTOMERS, MOCK_ORDERS, MOCK_PRODUCTS]);
  
  // Drag and Drop files / Sheet Import state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedWorkbook, setUploadedWorkbook] = useState(null); 

  // File Handle & Save Workflow State (Replaced Browser-only storage)
  const [fileHandle, setFileHandle] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [workflowName, setWorkflowName] = useState('Untitled Pipeline');
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [isRestoring, setIsRestoring] = useState(true);

  // Modal State for Field Deletion Dependencies
  const [deletionWarning, setDeletionWarning] = useState(null);

  const [nodes, setNodes] = useState([
    { id: 'node_1', type: 'INPUT', position: { x: 50, y: 120 }, config: { dataset: MOCK_ORDERS }, outputData: null, status: 'idle', lastRunTime: null },
    { id: 'node_2', type: 'INPUT', position: { x: 50, y: 320 }, config: { dataset: MOCK_CUSTOMERS }, outputData: null, status: 'idle', lastRunTime: null },
    { id: 'node_3', type: 'LOOKUP', position: { x: 300, y: 220 }, config: { baseKey: 'CustomerID', lookupKey: 'CustomerID', returnCol: 'CustomerName', notFoundText: 'Anonymous' }, outputData: null, status: 'idle', lastRunTime: null },
    { id: 'node_4', type: 'FILTER', position: { x: 550, y: 220 }, config: { column: 'SalesAmount', operator: '>', value: '500' }, outputData: null, status: 'idle', lastRunTime: null }
  ]);

  const [edges, setEdges] = useState([
    { id: 'e_1', from: 'node_1', to: 'node_3', fromPort: 'out', toPort: 'in1' },
    { id: 'e_2', from: 'node_2', to: 'node_3', fromPort: 'out', toPort: 'in2' },
    { id: 'e_3', from: 'node_3', to: 'node_4', fromPort: 'out', toPort: 'in' }
  ]);

  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [previewPanelCollapsed, setPreviewPanelCollapsed] = useState(false);

  const [autoRun, setAutoRun] = useState(true);
  const [runTrigger, setRunTrigger] = useState(0);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [runGlobalStatus, setRunGlobalStatus] = useState('idle');

  const [selectedNodeId, setSelectedNodeId] = useState('node_4');
  const [selectedNodeIds, setSelectedNodeIds] = useState(new Set(['node_4']));
  const [clipboard, setClipboard] = useState({ nodes: [] });
  const nodesRef = useRef(nodes);
  const clipboardRef = useRef(clipboard);
  const selectedNodeIdsRef = useRef(selectedNodeIds);
  
  useEffect(() => {
    nodesRef.current = nodes;
    clipboardRef.current = clipboard;
    selectedNodeIdsRef.current = selectedNodeIds;
  }, [nodes, clipboard, selectedNodeIds]);
  
  const [groups, setGroups] = useState([]);
  const [canvasSearchQuery, setCanvasSearchQuery] = useState('');
  const [validationResults, setValidationResults] = useState([]);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [canvasOffset, setCanvasOffset] = useState({ x: 30, y: 30 });
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  
  const [connectingFrom, setConnectingFrom] = useState(null); 
  const [mouseCanvasPos, setMouseCanvasPos] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  
  // Smart Match criteria builder states
  const [smLeftCol, setSmLeftCol] = useState('');
  const [smRightCol, setSmRightCol] = useState('');
  const [smMatchType, setSmMatchType] = useState('exact');
  const [smWeight, setSmWeight] = useState(1.0);

  // Volume & Increment mapping builder states
  const [volMappingCoverage, setVolMappingCoverage] = useState('');
  const [volMappingVolume, setVolMappingVolume] = useState('');
  const [volMappingIncrement, setVolMappingIncrement] = useState('');
  const [volMappingReqIncrement, setVolMappingReqIncrement] = useState('');
  const [activeTab, setActiveTab] = useState('properties'); 
  const [activeAnalyticsSubTab, setActiveAnalyticsSubTab] = useState('script');
  const [previewTab, setPreviewTab] = useState('table');
  
  const [systemLogs, setSystemLogs] = useState([
    "System Initialized.",
    "Excel transformation compiler ready."
  ]);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const importFileInputRef = useRef(null);

  // Dynamic injection of SheetJS CDN
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
    script.async = true;
    script.onload = () => {
      setSheetjsLoaded(true);
      setSystemLogs(prev => [...prev, "[Excel Engine] SheetJS loaded. Full XLSX, XLS, XLSM, XLSB & ODS parsing unlocked."]);
    };
    script.onerror = () => {
      setSystemLogs(prev => [...prev, "[Excel Engine Warning] Could not reach SheetJS library. Falling back to native CSV/TSV parser."]);
    };
    document.body.appendChild(script);
    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {}
    };
  }, []);

  // AUTO-RESUME Logic
  useEffect(() => {
    try {
      const savedStateStr = localStorage.getItem('excelflow_v3.5_save');
      if (savedStateStr) {
        const parsed = JSON.parse(savedStateStr);
        const restoredNodes = (parsed.nodes || []).map(n => ({
          ...n,
          config: n.config || {}
        }));
        setNodes(restoredNodes);
        setEdges(parsed.edges || []);
        setDatasets(parsed.datasets || []);
        setCanvasOffset(parsed.canvasOffset || { x: 30, y: 30 });
        setCanvasZoom(parsed.canvasZoom || 1);
        setWorkflowName(parsed.workflowName || 'Untitled Pipeline');
        // We do NOT restore fileHandle from localStorage because FileSystemFileHandle 
        // cannot be serialized to JSON (it becomes an empty object {}). 
        // Storing/Restoring it breaks future file saves after a page reload.
        
        setSystemLogs(prev => [...prev, `[Auto-Resume] Restored cache state: "${parsed.workflowName || 'Untitled Pipeline'}"`]);
      }
    } catch (e) {
      console.error("Failed to restore save", e);
      setSystemLogs(prev => [...prev, `[Auto-Resume Error] Failed to parse local cached save.`]);
    } finally {
      setIsRestoring(false);
    }
  }, []);

  // REAL LOCAL FILE DIRECT WRITING & FALLBACK DIALOG DOWNLOADS
  const handleSaveWorkflowFile = async (forceSaveAs = false) => {
    const stateToSave = { nodes, edges, datasets, canvasOffset, canvasZoom, workflowName };
    
    // 1. Try modern File System Access API
    if (window.showSaveFilePicker) {
      try {
        let activeHandle = fileHandle;
        if (forceSaveAs || !activeHandle || activeHandle.isVirtual) {
          activeHandle = await window.showSaveFilePicker({
            suggestedName: `${workflowName.replace(/\s+/g, '_')}.ewf`,
            types: [{
              description: 'ExcelFlow Workflow File',
              accept: { 'application/json': ['.ewf', '.json'] }
            }]
          });
        }
        
        const writable = await activeHandle.createWritable();
        await writable.write(JSON.stringify(stateToSave, null, 2));
        await writable.close();
        
        setFileHandle(activeHandle);
        const cleanedName = activeHandle.name.replace(/\.[^/.]+$/, "");
        setWorkflowName(cleanedName);
        setSaveStatus('Saved to File');
        setSystemLogs(prev => [...prev, `[File System] Successfully wrote updates to local file: "${activeHandle.name}"`]);
        return;
      } catch (err) {
        // If aborted by user, stop
        if (err.name === 'AbortError') {
          setSystemLogs(prev => [...prev, `[File System] Save action cancelled.`]);
          return;
        }
        console.warn("File System Access Picker failed or was blocked inside iframe context. Falling back to Download simulation.", err);
      }
    }

    // 2. High-Fidelity Fallback Download Dialog
    try {
      const serialized = JSON.stringify(stateToSave, null, 2);
      const blob = new Blob([serialized], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      const cleanFileName = `${workflowName.replace(/\s+/g, '_')}.ewf`;
      
      downloadLink.setAttribute("href", url);
      downloadLink.setAttribute("download", cleanFileName);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
      
      // Simulate/register the virtual file name state so subsequent single "Save" clicks update without re-prompting if possible
      setFileHandle({ name: cleanFileName, isVirtual: true });
      setSaveStatus('Saved (Downloaded)');
      setSystemLogs(prev => [...prev, `[Local Save] Workflow compiled & exported local file: "${cleanFileName}"`]);
    } catch (err) {
      setSaveStatus('Save Failed');
      setSystemLogs(prev => [...prev, `[Local Save Error] Failed to export workflow file.`]);
    }
  };

  // AUTO-SAVE Loop (Updates current file if handle is valid, or caches to local storage backup)
  useEffect(() => {
    if (isRestoring) return;

    setSaveStatus('Saving...');
    const saveTimer = setTimeout(async () => {
      // Create a cacheable state. Do NOT include fileHandle here, 
      // otherwise it serializes as {} to localStorage and breaks session reloads.
      const stateToCache = { nodes, edges, datasets, canvasOffset, canvasZoom, workflowName };
      
      // Auto-save direct write to local file handle (if file handle exists and is NOT virtual fallback)
      if (autoSaveEnabled && fileHandle && !fileHandle.isVirtual) {
        try {
          const stateToSave = { ...stateToCache, fileHandle };
          const writable = await fileHandle.createWritable();
          await writable.write(JSON.stringify(stateToSave, null, 2));
          await writable.close();
          setSaveStatus('Auto-Saved');
          return;
        } catch (e) {
          // File handle write lock or security permission might fail. Fallback to LocalStorage cache.
        }
      }

      // LocalStorage background caching to ensure zero workflow progress is lost
      try {
        localStorage.setItem('excelflow_v3.5_save', JSON.stringify(stateToCache));
        setSaveStatus(fileHandle ? 'Auto-Saved' : 'Saved (Cache)');
      } catch (err) {
        if (err.name === 'QuotaExceededError') {
          try {
            // Strip out datasets heavy records array to save workflow logic
            const strippedDatasets = datasets.map(d => ({ ...d, data: [], needsRelink: true }));
            const backupState = { nodes, edges, datasets: strippedDatasets, canvasOffset, canvasZoom, workflowName };
            localStorage.setItem('excelflow_v3.5_save', JSON.stringify(backupState));
            setSaveStatus('Saved (Local Backup)');
          } catch(e) {
            setSaveStatus('Save Failed');
          }
        } else {
          setSaveStatus('Save Failed');
        }
      }
    }, 1500); // 1.5s debounce

    return () => clearTimeout(saveTimer);
  }, [nodes, edges, datasets, canvasOffset, canvasZoom, workflowName, isRestoring, autoSaveEnabled, fileHandle]);

  // Workflow Config importer
  const handleImportWorkflow = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        const importedNodes = (parsed.nodes || []).map(n => ({
          ...n,
          config: n.config || {}
        }));
        setNodes(importedNodes);
        setEdges(parsed.edges || []);
        setDatasets(parsed.datasets || []);
        setCanvasOffset(parsed.canvasOffset || { x: 30, y: 30 });
        setCanvasZoom(parsed.canvasZoom || 1);
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setWorkflowName(parsed.workflowName || nameWithoutExt);
        setFileHandle({ name: file.name, isVirtual: true });
        setSystemLogs(prev => [...prev, `[Import] Successfully loaded local config "${file.name}".`]);
        if (autoRun) setRunTrigger(prev => prev + 1);
      } catch(err) {
        setSystemLogs(prev => [...prev, `[Import Error] Failed to read JSON workflow file.`]);
      }
    };
    reader.readAsText(file);
    if (importFileInputRef.current) importFileInputRef.current.value = '';
  };


  const handleDragStartFromPalette = (e, toolId) => {
    e.dataTransfer.setData('application/excelflow-tool', toolId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCanvasDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnCanvas = (e) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const toolId = e.dataTransfer.getData('application/excelflow-tool');
    if (!toolId || !NODE_TYPES[toolId]) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;

    const graphX = Math.round((relativeX - canvasOffset.x) / canvasZoom);
    const graphY = Math.round((relativeY - canvasOffset.y) / canvasZoom);

    const newNode = {
      id: `node_${Date.now()}`,
      type: toolId,
      position: { 
        x: graphX - 88, 
        y: graphY - 38 
      },
      config: {},
      outputData: null,
      status: 'idle',
      lastRunTime: null
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setSystemLogs(prev => [...prev, `[Canvas] Spawned [${NODE_TYPES[toolId].name}] onto workspace.`]);
    
    if (autoRun) {
      setRunTrigger(prev => prev + 1);
    }
  };

  const runWorkflow = useCallback(async () => {
    setIsRunningAll(true);
    setRunGlobalStatus('running');
    setSystemLogs(prev => [...prev, `[Workflow] Compiling pipeline dependency-tree...`]);

    try {
      const adjList = {};
      const inDegree = {};
      const computedNodesMap = {};

      nodes.forEach(n => {
        adjList[n.id] = [];
        inDegree[n.id] = 0;
        computedNodesMap[n.id] = { ...n, status: 'running', outputData: null };
      });

      edges.forEach(edge => {
        if (adjList[edge.from] && inDegree[edge.to] !== undefined) {
          adjList[edge.from].push(edge.to);
          inDegree[edge.to]++;
        }
      });

      let visitedCount = 0;
      let queue = [];
      nodes.forEach(n => {
        if (inDegree[n.id] === 0) {
          queue.push(n.id);
        }
      });

      const layers = [];
      while (queue.length > 0) {
        layers.push([...queue]);
        const nextQueue = [];
        for (const u of queue) {
          visitedCount++;
          if (adjList[u]) {
            adjList[u].forEach(target => {
              inDegree[target]--;
              if (inDegree[target] === 0) {
                nextQueue.push(target);
              }
            });
          }
        }
        queue = nextQueue;
      }

      if (visitedCount !== nodes.length) {
        throw new Error("Circular dependency detected in workflow! Please remove loops.");
      }

      setNodes(Object.values(computedNodesMap));
      const updatedLogs = [];
      const executionStart = performance.now();

      for (const layer of layers) {
        await Promise.all(layer.map(async (nodeId) => {
          const node = computedNodesMap[nodeId];
          if (!node) return;

          if (node.disabled) {
            const incomingEdges = edges.filter(e => e.to === nodeId);
            const firstInput = incomingEdges.length > 0 ? computedNodesMap[incomingEdges[0].from]?.outputData : null;
            computedNodesMap[nodeId].outputData = firstInput || { columns: [], data: [], errors: ['Disabled'] };
            computedNodesMap[nodeId].status = 'disabled';
            updatedLogs.push(`Node [${nodeId}] skipped (disabled).`);
            return;
          }

          const incomingEdges = edges.filter(e => e.to === nodeId);
          incomingEdges.sort((a, b) => {
            if (a.toPort === 'in1' || a.toPort === 'in') return -1;
            if (b.toPort === 'in1' || b.toPort === 'in') return 1;
            return 0;
          });

          const inputs = incomingEdges.map(edge => {
            const parent = computedNodesMap[edge.from];
            return parent ? parent.outputData : null;
          }).filter(Boolean);

          try {
            const result = await evaluateNodeWithWorker(node, inputs);
            computedNodesMap[nodeId].outputData = result;
            
            if (result.errors && result.errors.length > 0) {
              computedNodesMap[nodeId].status = 'error';
              updatedLogs.push(`Node [${nodeId}] error: ${result.errors.join(', ')}`);
            } else {
              computedNodesMap[nodeId].status = 'success';
              computedNodesMap[nodeId].lastRunTime = new Date().toLocaleTimeString();
              const metrics = result.metrics || {};
              updatedLogs.push(`Node [${nodeId}] completed: ${metrics.rowCount || 0} rows, ${metrics.duration || 0}ms, ${metrics.memoryUsageMB || 0}MB.`);
            }
          } catch (err) {
            computedNodesMap[nodeId].status = 'error';
            computedNodesMap[nodeId].outputData = { errors: [err.message] };
            updatedLogs.push(`Node [${nodeId}] critical error: ${err.message}`);
          }
        }));
        
        setNodes(Object.values(computedNodesMap));
      }

      const totalDuration = Math.round(performance.now() - executionStart);
      setNodes(Object.values(computedNodesMap));
      setRunGlobalStatus(updatedLogs.some(l => l.includes('error')) ? 'failed' : 'success');
      setSystemLogs(prev => [
        ...prev, 
        ...updatedLogs,
        `[${new Date().toLocaleTimeString()}] Pipeline synchronization complete in ${totalDuration}ms.`
      ]);
    } catch (err) {
      setRunGlobalStatus('failed');
      setSystemLogs(prev => [...prev, `[Compiler Failure] ${err.message}`]);
    } finally {
      setIsRunningAll(false);
      setNodes(prev => prev.map(n => n.status === 'running' ? { ...n, status: 'error' } : n));
    }
  }, [nodes, edges]);

  useEffect(() => {
    if (runTrigger > 0 && autoRun) {
      runWorkflow();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runTrigger]);

  const runNodeLocally = async (nodeId) => {
    setSystemLogs(prev => [...prev, `[Isolated Execution] Processing branch ancestors of Node [${nodeId}]...`]);
    
    const ancestors = [];
    const visited = new Set();
    
    const findAncestors = (id) => {
      if (visited.has(id)) return;
      visited.add(id);
      const parentEdges = edges.filter(e => e.to === id);
      parentEdges.forEach(e => {
        findAncestors(e.from);
      });
      ancestors.push(id);
    };
    
    findAncestors(nodeId);

    const subAdjList = {};
    const subInDegree = {};
    ancestors.forEach(id => {
      subAdjList[id] = [];
      subInDegree[id] = 0;
    });

    edges.forEach(e => {
      if (ancestors.includes(e.from) && ancestors.includes(e.to)) {
        subAdjList[e.from].push(e.to);
        subInDegree[e.to]++;
      }
    });

    let queue = ancestors.filter(id => subInDegree[id] === 0);
    const layers = [];
    while (queue.length > 0) {
      layers.push([...queue]);
      const nextQueue = [];
      for (const u of queue) {
        subAdjList[u].forEach(target => {
          subInDegree[target]--;
          if (subInDegree[target] === 0) {
            nextQueue.push(target);
          }
        });
      }
      queue = nextQueue;
    }

    setNodes(prev => prev.map(n => ancestors.includes(n.id) ? { ...n, status: 'running', outputData: null } : n));

    const computedNodesMap = {};
    nodes.forEach(n => {
      computedNodesMap[n.id] = ancestors.includes(n.id) ? { ...n, status: 'running', outputData: null } : { ...n };
    });

    try {
      const executionStart = performance.now();
      for (const layer of layers) {
        await Promise.all(layer.map(async (aId) => {
          const node = computedNodesMap[aId];
          if (!node) return;

          const incoming = edges.filter(e => e.to === aId);
          incoming.sort((a, b) => {
            if (a.toPort === 'in1' || a.toPort === 'in') return -1;
            if (b.toPort === 'in1' || b.toPort === 'in') return 1;
            return 0;
          });

          const inputs = incoming.map(edge => {
            const parent = computedNodesMap[edge.from];
            return parent ? parent.outputData : null;
          }).filter(Boolean);

          try {
            const result = await evaluateNodeWithWorker(node, inputs);
            computedNodesMap[aId].outputData = result;
            computedNodesMap[aId].status = (result.errors && result.errors.length > 0) ? 'error' : 'success';
            computedNodesMap[aId].lastRunTime = new Date().toLocaleTimeString();
            if (result.metrics) {
               setSystemLogs(prev => [...prev, `Node [${aId}] execution time: ${result.metrics.duration}ms`]);
            }
          } catch (err) {
            computedNodesMap[aId].outputData = { errors: [err.message] };
            computedNodesMap[aId].status = 'error';
          }
        }));
        setNodes(Object.values(computedNodesMap));
      }

      setSystemLogs(prev => [...prev, `[Standalone Completed] Branch output created for Node [${nodeId}] in ${Math.round(performance.now() - executionStart)}ms.`]);
    } catch (err) {
      setSystemLogs(prev => [...prev, `[Isolated Run Error] Failed for node [${nodeId}]: ${err.message}`]);
    } finally {
      setNodes(prev => prev.map(n => n.status === 'running' ? { ...n, status: 'idle' } : n));
    }
  };

  useEffect(() => {
    if (selectedNodeId) {
      setRightPanelCollapsed(false);
      setActiveTab('properties');
    }
  }, [selectedNodeId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      const currentNodes = nodesRef.current;
      const currentSelectedIds = selectedNodeIdsRef.current;
      const currentClipboard = clipboardRef.current;

      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const copiedNodes = currentNodes.filter(n => currentSelectedIds.has(n.id));
        if (copiedNodes.length > 0) {
          setClipboard({ nodes: JSON.parse(JSON.stringify(copiedNodes)) });
          setSystemLogs(prev => [...prev, `[Clipboard] Copied ${copiedNodes.length} node(s).`]);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (currentClipboard.nodes.length > 0) {
          const newSelectedIds = new Set();
          const newNodes = currentClipboard.nodes.map((n, idx) => {
            const newId = `node_${Date.now()}_${idx}`;
            newSelectedIds.add(newId);
            return {
              ...n,
              id: newId,
              position: { x: n.position.x + 48, y: n.position.y + 48 },
              outputData: null,
              status: 'idle',
              lastRunTime: null
            };
          });
          
          setNodes(prev => [...prev, ...newNodes]);
          setSelectedNodeIds(newSelectedIds);
          if (newSelectedIds.size > 0) setSelectedNodeId([...newSelectedIds][0]);
          setSystemLogs(prev => [...prev, `[Clipboard] Pasted ${newNodes.length} node(s).`]);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        if (currentSelectedIds.size > 1) {
          const newGroup = { id: `group_${Date.now()}`, nodeIds: Array.from(currentSelectedIds) };
          setGroups(prev => [...prev, newGroup]);
          setSystemLogs(prev => [...prev, `[Group] Created group with ${currentSelectedIds.size} nodes.`]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerAutoRunIfEnabled = () => {
    if (autoRun) {
      runWorkflow();
    } else {
      if (selectedNodeId) {
        setNodes(prev => prev.map(n => 
          n.id === selectedNodeId ? { ...n, status: 'stale' } : n
        ));
      }
    }
  };

  const autoMatchJoinKeys = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const incomingEdges = edges.filter(e => e.to === nodeId);
    const leftEdge = incomingEdges.find(e => e.toPort === 'in1' || e.toPort === 'in');
    const rightEdge = incomingEdges.find(e => e.toPort === 'in2');

    const leftNode = leftEdge ? nodes.find(n => n.id === leftEdge.from) : null;
    const rightNode = rightEdge ? nodes.find(n => n.id === rightEdge.from) : null;

    if (!leftNode || !rightNode || !leftNode.outputData || !rightNode.outputData) {
      setSystemLogs(prev => [...prev, `[Auto-Match] Upstream schemas must be running to auto-match attributes.`]);
      return;
    }

    const leftCols = leftNode.outputData.columns;
    const rightCols = rightNode.outputData.columns;

    let matchedKey = null;
    for (const lCol of leftCols) {
      const match = rightCols.find(rCol => rCol.toLowerCase() === lCol.toLowerCase());
      if (match) {
        matchedKey = { left: lCol, right: match };
        break;
      }
    }

    if (matchedKey) {
      setNodes(prev => prev.map(n => {
        if (n.id === nodeId) {
          const updatedConfig = { ...n.config };
          if (n.type === 'JOIN') {
            updatedConfig.leftKey = matchedKey.left;
            updatedConfig.rightKey = matchedKey.right;
          } else if (n.type === 'LOOKUP') {
            updatedConfig.baseKey = matchedKey.left;
            updatedConfig.lookupKey = matchedKey.right;
          }
          return { ...n, config: updatedConfig, status: 'stale' };
        }
        return n;
      }));
      setSystemLogs(prev => [...prev, `[Auto-Match Success] Unified join keys on common attribute: "${matchedKey.left}".`]);
      if (autoRun) setRunTrigger(prev => prev + 1);
    } else {
      setSystemLogs(prev => [...prev, `[Auto-Match] Checked ${leftCols.length} left attributes & ${rightCols.length} right attributes. No explicit common keys found.`]);
    }
  };

  const getDownstreamDependentsOfField = useCallback((nodeId, fieldName) => {
    const dependents = [];
    const visited = new Set();

    const trace = (currId, currentFieldName) => {
      if (visited.has(currId)) return;
      visited.add(currId);

      const outgoingEdges = edges.filter(e => e.from === currId);
      outgoingEdges.forEach(edge => {
        const targetNode = nodes.find(n => n.id === edge.to);
        if (!targetNode) return;
        
        let isDependent = false;
        let nextFieldName = currentFieldName;

        if (targetNode.type === 'SELECT') {
          const selected = targetNode.config.selectedColumns || [];
          const renamed = targetNode.config.renames?.[currentFieldName];
          if (selected.includes(currentFieldName)) {
            if (renamed) nextFieldName = renamed;
          } else {
            return;
          }
        } else if (targetNode.type === 'FILTER') {
          if (targetNode.config.column === currentFieldName) {
            isDependent = true;
          }
        } else if (targetNode.type === 'SORT') {
          if (targetNode.config.column === currentFieldName) {
            isDependent = true;
          }
        } else if (targetNode.type === 'FORMULA') {
          if (targetNode.config.customFormula?.includes(`[${currentFieldName}]`)) {
            isDependent = true;
          }
        } else if (targetNode.type === 'CONCAT') {
          if (targetNode.config.selectedFields?.includes(currentFieldName)) {
            isDependent = true;
          }
        } else if (targetNode.type === 'JOIN') {
          if (targetNode.config.leftKey === currentFieldName || targetNode.config.rightKey === currentFieldName) {
            isDependent = true;
          }
        } else if (targetNode.type === 'LOOKUP') {
          if (targetNode.config.baseKey === currentFieldName || targetNode.config.lookupKey === currentFieldName) {
            isDependent = true;
          }
        } else if (targetNode.type === 'SUMMARIZE') {
          if (targetNode.config.groupBy === currentFieldName || targetNode.config.aggCol === currentFieldName) {
            isDependent = true;
          }
        } else if (targetNode.type === 'RUNNING_TOTAL' || targetNode.type === 'NULL_CHECK') {
          if (targetNode.config.column === currentFieldName) {
            isDependent = true;
          }
        }

        if (isDependent) {
          dependents.push({
            nodeId: targetNode.id,
            type: targetNode.type,
            name: NODE_TYPES[targetNode.type]?.name || targetNode.type
          });
        }

        trace(targetNode.id, nextFieldName);
      });
    };

    trace(nodeId, fieldName);
    return dependents;
  }, [nodes, edges]);

  const executeFieldDeletion = (nodeId, fieldName) => {
    setNodes(prevNodes => prevNodes.map(n => {
      if (n.id === nodeId) {
        let nextSelected;
        if (n.config.selectedColumns) {
          nextSelected = n.config.selectedColumns.filter(c => c !== fieldName);
        } else {
          const incoming = edges.find(e => e.to === nodeId);
          const parent = incoming ? prevNodes.find(pn => pn.id === incoming.from) : null;
          const parentCols = parent?.outputData?.columns || n.outputData?.columns || [];
          nextSelected = parentCols.filter(c => c !== fieldName);
        }
        
        const nextRenames = { ...(n.config.renames || {}) };
        delete nextRenames[fieldName];
        return {
          ...n,
          config: {
            ...n.config,
            selectedColumns: nextSelected,
            renames: nextRenames
          },
          status: 'stale'
        };
      }
      return n;
    }));

    setSystemLogs(prev => [...prev, `[Field Deleted] Excluded and fully deleted "${fieldName}" from select mapping.`]);
    setDeletionWarning(null);
    if (autoRun) setRunTrigger(prev => prev + 1);
  };

  const handleAttemptFieldDelete = (nodeId, fieldName) => {
    const dependents = getDownstreamDependentsOfField(nodeId, fieldName);
    if (dependents.length > 0) {
      setDeletionWarning({
        nodeId,
        fieldName,
        dependents
      });
    } else {
      executeFieldDeletion(nodeId, fieldName);
    }
  };

  const handleSpreadsheetUpload = (file) => {
    if (!file) return;

    const fileExt = file.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['xlsx', 'xls', 'xlsm', 'xlsb', 'csv', 'tsv', 'ods'];
    
    if (!allowedExtensions.includes(fileExt)) {
      setUploadError(`Unsupported file extension: .${fileExt}. Upload standard spreadsheets.`);
      setSystemLogs(prev => [...prev, `[File Validation Failure] Unsupported format requested: .${fileExt}`]);
      return;
    }

    setUploadError(null);
    setUploadProgress(10);
    setSystemLogs(prev => [...prev, `[Import Engine] Reading spreadsheet: "${file.name}"...`]);

    const reader = new FileReader();

    if (fileExt === 'csv' || fileExt === 'tsv') {
      reader.onload = (evt) => {
        setUploadProgress(60);
        try {
          const text = evt.target.result;
          const separator = fileExt === 'tsv' ? '\t' : ',';
          const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
          
          if (lines.length === 0) {
            throw new Error("Empty spreadsheet records.");
          }

          const columns = lines[0].split(separator).map(c => c.replace(/^"|"$/g, '').trim());
          const records = lines.slice(1).map((line) => {
            const vals = line.split(separator).map(v => v.replace(/^"|"$/g, '').trim());
            const item = {};
            columns.forEach((col, cIndex) => {
              item[col] = vals[cIndex] !== undefined ? vals[cIndex] : '';
            });
            return item;
          });

          const mockWorkbook = {
            fileName: file.name,
            fileSize: (file.size / 1024).toFixed(1) + " KB",
            sheets: [
              {
                sheetName: 'Sheet1',
                columns,
                data: records
              }
            ]
          };

          setUploadedWorkbook(mockWorkbook);
          setUploadProgress(100);
          setSystemLogs(prev => [...prev, `[Parser Completed] Read standard flat format "${file.name}".`]);

          const dsId = `ds_uploaded_${Date.now()}`;
          const newDs = {
            id: dsId,
            name: file.name,
            sheetName: 'Sheet1',
            columns,
            data: records
          };
          setDatasets(prev => {
            // Strip out datasets that are marked needsRelink that match this name to 'refresh' them
            const cleaned = prev.filter(p => !(p.needsRelink && p.name === file.name));
            return [...cleaned, newDs];
          });
          
          if (selectedNodeId) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node && node.type === 'INPUT') {
              updateNodeConfig(node.id, 'dataset', newDs);
              setSystemLogs(prev => [...prev, `[Auto-Sync] Live-linked uploaded workbook sheets to active Input Node [${node.id}].`]);
            }
          }
        } catch (err) {
          setUploadProgress(0);
          setUploadError(`Failed to parse text spreadsheet: ${err.message}`);
        }
      };
      reader.readAsText(file);
    } else {
      if (!sheetjsLoaded || !window.XLSX) {
        setUploadProgress(0);
        setUploadError("Spreadsheet parser engine not loaded yet. Re-attempt drop in 2 seconds.");
        return;
      }

      reader.onload = (evt) => {
        setUploadProgress(50);
        try {
          const data = new Uint8Array(evt.target.result);
          if (data.length < 10) {
            throw new Error("Workbook schema corrupted or incomplete.");
          }

          const workbook = window.XLSX.read(data, { type: 'array' });
          const sheetsList = [];

          setUploadProgress(80);

          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const parsedRows = window.XLSX.utils.sheet_to_json(worksheet, { defval: "" });
            
            if (parsedRows.length > 0) {
              const columns = Object.keys(parsedRows[0]);
              sheetsList.push({
                sheetName,
                columns,
                data: parsedRows
              });
            }
          });

          if (sheetsList.length === 0) {
            throw new Error("No sheets containing data headers found in the workbook.");
          }

          const completedWorkbook = {
            fileName: file.name,
            fileSize: (file.size / 1024).toFixed(1) + " KB",
            sheets: sheetsList
          };

          setUploadedWorkbook(completedWorkbook);
          setUploadProgress(100);
          setSystemLogs(prev => [...prev, `[Workbook Parsed] Dynamic parser unpacked "${file.name}" with ${sheetsList.length} sheets.`]);

          const primarySheet = sheetsList[0];
          const dsId = `ds_uploaded_${Date.now()}`;
          const newDsName = `${file.name}::${primarySheet.sheetName}`;
          const newDs = {
            id: dsId,
            name: newDsName,
            sheetName: primarySheet.sheetName,
            columns: primarySheet.columns,
            data: primarySheet.data
          };

          setDatasets(prev => {
            // Re-link missing files if name matches
            const cleaned = prev.filter(p => !(p.needsRelink && p.name === newDsName));
            return [...cleaned, newDs];
          });

          if (selectedNodeId) {
            const node = nodes.find(n => n.id === selectedNodeId);
            if (node && node.type === 'INPUT') {
              updateNodeConfig(node.id, 'dataset', newDs);
              setSystemLogs(prev => [...prev, `[Auto-Sync] Live-linked uploaded sheet "${primarySheet.sheetName}" to selected Input Node.`]);
            }
          }
        } catch (err) {
          setUploadProgress(0);
          setUploadError(`Spreadsheet parsing aborted: ${err.message}`);
          setSystemLogs(prev => [...prev, `[Parsing Corrupted] Failed workbook verification: ${err.message}`]);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const importSheetToCatalog = (sheetObj, workbookName) => {
    const dsId = `ds_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    const newDsName = `${workbookName}::${sheetObj.sheetName}`;
    const newDs = {
      id: dsId,
      name: newDsName,
      sheetName: sheetObj.sheetName,
      columns: sheetObj.columns,
      data: sheetObj.data
    };

    setDatasets(prev => {
      const cleaned = prev.filter(p => !(p.needsRelink && p.name === newDsName));
      return [...cleaned, newDs];
    });
    setSystemLogs(prev => [...prev, `[Catalog Injected] sheet "${sheetObj.sheetName}" registered with ${sheetObj.data.length} records.`]);
    
    const spawnNode = {
      id: `node_gen_${Date.now()}`,
      type: 'INPUT',
      position: { x: 80, y: 150 + (datasets.length * 40) },
      config: { dataset: newDs },
      outputData: null,
      status: 'idle',
      lastRunTime: null
    };
    setNodes(prev => [...prev, spawnNode]);
    setSelectedNodeId(spawnNode.id);
    if (autoRun) setRunTrigger(prev => prev + 1);
  };

  const handleToolDropOrClick = (toolId) => {
    const randomOffset = () => Math.floor(Math.random() * 40) - 20;
    const newNode = {
      id: `node_${Date.now()}`,
      type: toolId,
      position: { 
        x: 220 + randomOffset(), 
        y: 150 + randomOffset() 
      },
      config: {},
      outputData: null,
      status: 'idle',
      lastRunTime: null
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setSystemLogs(prev => [...prev, `Injected block [${NODE_TYPES[toolId].name}] onto workspace.`]);
    triggerAutoRunIfEnabled();
  };

  const handleNodeDragStart = (e, nodeId) => {
    e.stopPropagation();
    
    let currentSelectedIds = new Set(selectedNodeIds);
    if (e.shiftKey) {
      if (currentSelectedIds.has(nodeId)) {
        currentSelectedIds.delete(nodeId);
      } else {
        currentSelectedIds.add(nodeId);
      }
    } else {
      if (!currentSelectedIds.has(nodeId)) {
        currentSelectedIds = new Set([nodeId]);
      }
    }
    
    setSelectedNodeId(nodeId);
    setSelectedNodeIds(currentSelectedIds);
    
    const startX = e.clientX;
    const startY = e.clientY;

    const draggedNodesStartPos = {};
    nodes.forEach(n => {
      if (currentSelectedIds.has(n.id)) {
        draggedNodesStartPos[n.id] = { x: n.position.x, y: n.position.y };
      }
    });

    const handlePointerMove = (moveEv) => {
      const dx = (moveEv.clientX - startX) / canvasZoom;
      const dy = (moveEv.clientY - startY) / canvasZoom;
      
      setNodes(prev => prev.map(n => {
        if (currentSelectedIds.has(n.id)) {
          const rawX = draggedNodesStartPos[n.id].x + dx;
          const rawY = draggedNodesStartPos[n.id].y + dy;
          const snappedX = Math.round(rawX / 24) * 24;
          const snappedY = Math.round(rawY / 24) * 24;
          return { ...n, position: { x: snappedX, y: snappedY }, status: 'stale' };
        }
        return n;
      }));
    };

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);
  };

  const handleCanvasMouseDown = (e) => {
    if (e.target.closest('.flow-node') || e.target.closest('.port-dot') || e.target.closest('.badge-action')) return;
    setIsDraggingCanvas(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDraggingCanvas) return;
    const dx = e.clientX - dragStartPos.x;
    const dy = e.clientY - dragStartPos.y;
    setCanvasOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleCanvasMouseUp = () => setIsDraggingCanvas(false);

  const handlePortPointerDown = (e, nodeId, portId) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!canvasRef.current) return;
    setConnectingFrom({ nodeId, portId });
    
    const getGraphCoords = (clientX, clientY) => {
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        x: (clientX - rect.left - canvasOffset.x) / canvasZoom,
        y: (clientY - rect.top - canvasOffset.y) / canvasZoom
      };
    };

    setMouseCanvasPos(getGraphCoords(e.clientX, e.clientY));

    const handleGlobalPointerMove = (moveEv) => {
      setMouseCanvasPos(getGraphCoords(moveEv.clientX, moveEv.clientY));
    };

    const handleGlobalPointerUp = (upEv) => {
      document.removeEventListener('pointermove', handleGlobalPointerMove);
      document.removeEventListener('pointerup', handleGlobalPointerUp);
      document.removeEventListener('pointercancel', handleGlobalPointerUp);
      
      const elem = document.elementFromPoint(upEv.clientX, upEv.clientY);
      const targetPortDot = elem?.closest('.port-dot-input');
      
      if (targetPortDot) {
        const targetNodeId = targetPortDot.getAttribute('data-node-id');
        const targetPortId = targetPortDot.getAttribute('data-port-id');
        
        if (targetNodeId && targetNodeId !== nodeId) {
          const duplicate = edges.some(edge => 
            edge.to === targetNodeId && edge.toPort === targetPortId
          );

          if (!duplicate) {
            const newEdge = {
              id: `edge_${Date.now()}`,
              from: nodeId,
              to: targetNodeId,
              fromPort: portId,
              toPort: targetPortId
            };
            setEdges(prev => [...prev, newEdge]);
            setSystemLogs(prev => [...prev, `Pipeline linked: [${nodeId}] mapped to input port of [${targetNodeId}].`]);
            
            if (autoRun) {
              runWorkflow();
            } else {
              setNodes(prev => prev.map(n => n.id === targetNodeId ? { ...n, status: 'stale' } : n));
            }
          }
        }
      }
      
      setConnectingFrom(null);
      setMouseCanvasPos(null);
    };

    document.addEventListener('pointermove', handleGlobalPointerMove);
    document.addEventListener('pointerup', handleGlobalPointerUp);
    document.addEventListener('pointercancel', handleGlobalPointerUp);
  };

  const handlePortInteraction = (e, nodeId, portId) => {
    e.stopPropagation();
    
    if (portId === 'out') {
      setConnectingFrom({ nodeId, portId });
    } else {
      if (connectingFrom && connectingFrom.nodeId !== nodeId) {
        const duplicate = edges.some(edge => 
          edge.to === nodeId && edge.toPort === portId
        );

        if (!duplicate) {
          const newEdge = {
            id: `edge_${Date.now()}`,
            from: connectingFrom.nodeId,
            to: nodeId,
            fromPort: connectingFrom.portId,
            toPort: portId
          };
          setEdges(prev => [...prev, newEdge]);
          setSystemLogs(prev => [...prev, `Pipeline linked: [${connectingFrom.nodeId}] connected to [${nodeId}].`]);
          if (autoRun) {
            runWorkflow();
          } else {
            setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'stale' } : n));
          }
        }
        setConnectingFrom(null);
      }
    }
  };

  const deleteEdge = (edgeId) => {
    setEdges(prev => prev.filter(e => e.id !== edgeId));
    setSystemLogs(prev => [...prev, `Pipeline link wire deleted.`]);
    triggerAutoRunIfEnabled();
  };

  const deleteSelectedNode = (nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.from !== nodeId && e.to !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
    setSystemLogs(prev => [...prev, `Removed Node [${nodeId}] from pipeline.`]);
    
    if (autoRun) {
      setRunTrigger(prev => prev + 1);
    }
  };

  const updateNodeConfig = (nodeId, key, value) => {
    setNodes(prev => prev.map(n => 
      n.id === nodeId 
        ? { ...n, config: { ...n.config, [key]: value }, status: 'stale', outputData: null } 
        : n
    ));
    if (autoRun) {
      setRunTrigger(prev => prev + 1);
    }
  };

  const handleExportData = () => {
    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    if (!selectedNode || !selectedNode.outputData || !selectedNode.outputData.data.length) {
      return;
    }
    const csvContent = convertToCSV(selectedNode.outputData.columns, selectedNode.outputData.data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ExcelFlow_${selectedNode.type}_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSystemLogs(prev => [...prev, `Exported ${selectedNode.outputData.data.length} records to local CSV spreadsheet.`]);
  };

  const filteredTools = useMemo(() => {
    return Object.values(NODE_TYPES).filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const activeNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId);
  }, [selectedNodeId, nodes]);

  const upstreamColsForActiveNode = useMemo(() => {
    if (!activeNode) return [];
    const incoming = edges.find(e => e.to === activeNode.id);
    const parent = incoming ? nodes.find(n => n.id === incoming.from) : null;
    return parent?.outputData?.columns || [];
  }, [activeNode, edges, nodes]);

  const getPortCoordinates = (nodeId, portId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return { x: 0, y: 0 };

    const width = 176; 
    const height = 98; 

    if (portId === 'out') {
      return { x: node.position.x + width, y: node.position.y + height / 2 };
    }
    if (portId === 'in') {
      return { x: node.position.x, y: node.position.y + height / 2 };
    }
    if (portId === 'in1') {
      return { x: node.position.x, y: node.position.y + height / 3 };
    }
    if (portId === 'in2') {
      return { x: node.position.x, y: node.position.y + (2 * height / 3) };
    }

    return { x: node.position.x, y: node.position.y + height / 2 };
  };

  // Helper evaluator specifically for Live Side-by-side Concat Property Panels
  const previewConcatenationOutput = (row, config) => {
    if (!row) return '';
    const fields = config.selectedFields || [];
    const sepType = config.separator || 'space';
    let sep = ' ';
    if (sepType === 'dash') sep = '-';
    else if (sepType === 'underscore') sep = '_';
    else if (sepType === 'custom') sep = config.customSeparator || '';

    const trim = config.trimSpaces !== false;
    const ignoreBlank = config.ignoreBlank !== false;
    const casing = config.caseConversion || 'none';
    const prefix = config.prefix || '';
    const suffix = config.suffix || '';

    let parts = fields.map(f => row[f] !== undefined && row[f] !== null ? String(row[f]) : '');
    if (trim) parts = parts.map(p => p.trim());
    if (ignoreBlank) parts = parts.filter(p => p !== '');

    let combined = parts.join(sep);
    if (casing === 'upper') combined = combined.toUpperCase();
    if (casing === 'lower') combined = combined.toLowerCase();
    
    combined = prefix + combined + suffix;
    if (trim) combined = combined.trim();

    return combined;
  };

  const toggleNodeDisabled = (nodeId) => {
    setNodes(prev => prev.map(n => 
      n.id === nodeId ? { ...n, disabled: !n.disabled, status: n.disabled ? 'idle' : 'disabled' } : n
    ));
    setSystemLogs(prev => [...prev, `[Node] Toggled disable state for ${nodeId}.`]);
  };

  const validateWorkflow = () => {
    const issues = [];
    nodes.forEach(n => {
      const meta = NODE_TYPES[n.type];
      if (!meta) return;
      if (meta.inputs > 0) {
        const incoming = edges.filter(e => e.to === n.id);
        if (incoming.length === 0) issues.push({ nodeId: n.id, type: 'warning', msg: `${meta.name} (${n.id}) has no input connections.` });
      }
      if (n.type === 'INPUT' && !n.config?.dataset) issues.push({ nodeId: n.id, type: 'error', msg: `${meta.name} (${n.id}) has no dataset configured.` });
      if (n.type === 'FILTER' && !n.config?.column) issues.push({ nodeId: n.id, type: 'warning', msg: `Filter (${n.id}) has no column configured.` });
      if (n.type === 'FORMULA' && !n.config?.customFormula) issues.push({ nodeId: n.id, type: 'warning', msg: `Formula (${n.id}) has no expression.` });
    });
    const orphanNodes = nodes.filter(n => {
      const meta = NODE_TYPES[n.type];
      if (!meta || n.type === 'COMMENT') return false;
      const hasIn = edges.some(e => e.to === n.id);
      const hasOut = edges.some(e => e.from === n.id);
      return meta.inputs > 0 && !hasIn && meta.outputs > 0 && !hasOut;
    });
    orphanNodes.forEach(n => issues.push({ nodeId: n.id, type: 'warning', msg: `${NODE_TYPES[n.type]?.name} (${n.id}) is completely disconnected.` }));
    setValidationResults(issues);
    setSystemLogs(prev => [...prev, `[Validation] Found ${issues.length} issue(s).`]);
    return issues;
  };

  const alignSelectedNodes = (direction) => {
    const ids = Array.from(selectedNodeIds);
    if (ids.length < 2) return;
    const selected = nodes.filter(n => ids.includes(n.id));
    
    setNodes(prev => prev.map(n => {
      if (!ids.includes(n.id)) return n;
      let newPos = { ...n.position };
      if (direction === 'left') newPos.x = Math.min(...selected.map(s => s.position.x));
      if (direction === 'right') newPos.x = Math.max(...selected.map(s => s.position.x));
      if (direction === 'top') newPos.y = Math.min(...selected.map(s => s.position.y));
      if (direction === 'bottom') newPos.y = Math.max(...selected.map(s => s.position.y));
      if (direction === 'distributeH') {
        const sorted = [...selected].sort((a, b) => a.position.x - b.position.x);
        const idx = sorted.findIndex(s => s.id === n.id);
        const minX = sorted[0].position.x;
        const maxX = sorted[sorted.length - 1].position.x;
        const step = sorted.length > 1 ? (maxX - minX) / (sorted.length - 1) : 0;
        newPos.x = Math.round((minX + idx * step) / 24) * 24;
      }
      if (direction === 'distributeV') {
        const sorted = [...selected].sort((a, b) => a.position.y - b.position.y);
        const idx = sorted.findIndex(s => s.id === n.id);
        const minY = sorted[0].position.y;
        const maxY = sorted[sorted.length - 1].position.y;
        const step = sorted.length > 1 ? (maxY - minY) / (sorted.length - 1) : 0;
        newPos.y = Math.round((minY + idx * step) / 24) * 24;
      }
      return { ...n, position: newPos };
    }));
    setSystemLogs(prev => [...prev, `[Align] Applied ${direction} alignment to ${ids.length} nodes.`]);
  };

  const handleAutoLayout = () => {
    const adjList = {};
    const inDegree = {};
    
    nodes.forEach(n => {
      adjList[n.id] = [];
      inDegree[n.id] = 0;
    });

    edges.forEach(edge => {
      if (adjList[edge.from] && inDegree[edge.to] !== undefined) {
        adjList[edge.from].push(edge.to);
        inDegree[edge.to]++;
      }
    });

    let queue = [];
    nodes.forEach(n => {
      if (inDegree[n.id] === 0) queue.push(n.id);
    });

    const layers = [];
    while (queue.length > 0) {
      layers.push([...queue]);
      const nextQueue = [];
      for (const u of queue) {
        if (adjList[u]) {
          adjList[u].forEach(target => {
            inDegree[target]--;
            if (inDegree[target] === 0) {
              nextQueue.push(target);
            }
          });
        }
      }
      queue = nextQueue;
    }

    const newNodes = [...nodes];
    const LAYER_WIDTH = 280;
    const NODE_HEIGHT = 120;
    
    layers.forEach((layer, colIndex) => {
      layer.forEach((nodeId, rowIndex) => {
        const nodeIdx = newNodes.findIndex(n => n.id === nodeId);
        if (nodeIdx > -1) {
          const startY = (Math.max(0, 4 - layer.length) * NODE_HEIGHT) / 2;
          newNodes[nodeIdx] = {
            ...newNodes[nodeIdx],
            position: {
              x: Math.round((colIndex * LAYER_WIDTH) / 24) * 24,
              y: Math.round((startY + (rowIndex * NODE_HEIGHT)) / 24) * 24
            }
          };
        }
      });
    });

    setNodes(newNodes);
    setSystemLogs(prev => [...prev, `[Auto Layout] Organized ${nodes.length} nodes into ${layers.length} sequential layers.`]);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#050e10] text-[#cfdadc] font-sans overflow-hidden select-none">
      
      <style>{`
        @keyframes flowDash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .animate-flow-dash {
          animation: flowDash 0.8s linear infinite;
        }
        .glow-node-orange {
          box-shadow: 0 0 16px rgba(249, 115, 22, 0.55);
          border-color: #f97316 !important;
        }
        .glow-node-teal {
          box-shadow: 0 0 16px rgba(13, 148, 136, 0.55);
          border-color: #0d9488 !important;
        }
        .glow-node-amber {
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.55);
          border-color: #f59e0b !important;
        }
        .glow-node-cyan {
          box-shadow: 0 0 16px rgba(6, 182, 212, 0.55);
          border-color: #06b6d4 !important;
        }
        .glow-node-emerald {
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.55);
          border-color: #10b981 !important;
        }
        .glow-node-red {
          box-shadow: 0 0 16px rgba(239, 68, 68, 0.6);
          border-color: #ef4444 !important;
        }
        
        /* Thin elegant scrollbars */
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #091b1e;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #11363c;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #1c525b;
        }
      `}</style>

      {/* COMPACT DEEP TEAL + ORANGE HEADER BAR */}
      <header className="h-14 bg-[#071518] border-b border-teal-950/60 flex items-center justify-between px-5 shadow-lg z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 p-1.5 rounded-lg text-white shadow shadow-orange-500/10">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold text-teal-100 tracking-wider">ExcelFlow <span className="text-orange-500">ENGINE</span></h1>
              <span className="text-[8px] bg-teal-900/40 text-teal-400 font-mono border border-teal-800/40 px-1 py-0.2 rounded font-bold">V3.5 PRO</span>
            </div>
            
            <div className="flex items-center gap-2 mt-0.5">
              <input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="bg-transparent border-b border-transparent hover:border-teal-800 focus:border-orange-500 text-teal-300 font-mono text-[10px] w-40 focus:outline-none transition-all placeholder-teal-700 font-bold"
                placeholder="Name your workflow..."
              />
              <div className="flex items-center gap-1.5 text-[8.5px] font-mono text-teal-500 px-1.5 py-0.5 rounded bg-teal-950/40">
                {saveStatus === 'Saving...' && <RefreshCcw className="w-2.5 h-2.5 animate-spin text-orange-400" />}
                {saveStatus.includes('Saved') && <CheckCircle2 className="w-2.5 h-2.5 text-teal-400" />}
                {saveStatus.includes('Failed') && <AlertTriangle className="w-2.5 h-2.5 text-red-400" />}
                <span className="uppercase">{saveStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* WORKFLOW PIPELINE INTERACTION BLOCK */}
        <div className="flex items-center gap-3.5 bg-[#091b1e] px-3.5 py-1.5 rounded-lg border border-teal-950">
          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="auto-run-toggle"
              checked={autoRun}
              onChange={(e) => {
                setAutoRun(e.target.checked);
                setSystemLogs(prev => [...prev, `Auto-Compile compiler mode is now ${e.target.checked ? 'ENABLED' : 'DISABLED'}`]);
                if (e.target.checked) runWorkflow();
              }}
              className="w-3.5 h-3.5 rounded bg-slate-950 text-orange-600 border-teal-900 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="auto-run-toggle" className="text-[10px] font-mono font-bold text-teal-400 select-none cursor-pointer">
              AUTO RUN
            </label>
          </div>

          <div className="h-3 w-px bg-teal-900/60" />

          <button
            onClick={() => runWorkflow()}
            disabled={isRunningAll}
            className={`flex items-center gap-1.5 px-3.5 py-1 rounded shadow-md font-bold text-[10px] uppercase tracking-wider transition-all duration-200 ${
              isRunningAll 
                ? 'bg-teal-950 text-teal-600 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-500 text-white active:scale-95'
            }`}
          >
            {isRunningAll ? (
              <>
                <RefreshCcw className="w-3.5 h-3.5 animate-spin text-orange-400" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-white" />
                <span>Run Pipeline</span>
              </>
            )}
          </button>
        </div>

        {/* FILE INTEGRATION CONTROLS (REAL SAVING DIALOGS & FALLBACKS) */}
        <div className="flex items-center gap-2 text-[11px]">
          {/* Real Local Save controls group */}
          <div className="flex items-center gap-1 bg-[#091b1e] rounded-lg border border-teal-950 p-0.5 mr-2">
            <button 
              onClick={() => handleSaveWorkflowFile(false)}
              className="p-1.5 hover:bg-teal-900 text-teal-300 hover:text-white rounded transition-colors flex items-center gap-1 font-bold text-[10px]"
              title="Save Workflow File Updates (Direct Write)"
            >
              <Save className="w-3.5 h-3.5 text-orange-500" /> Save
            </button>
            <button 
              onClick={() => handleSaveWorkflowFile(true)}
              className="p-1.5 hover:bg-teal-900 text-teal-400 hover:text-white rounded transition-colors flex items-center gap-1 text-[10px]"
              title="Save Workflow File As... (Opens File Dialog)"
            >
              <Copy className="w-3.5 h-3.5 text-teal-500" /> Save As
            </button>
            <button 
              onClick={() => importFileInputRef.current?.click()}
              className="p-1.5 hover:bg-teal-900 text-teal-400 hover:text-white rounded transition-colors flex items-center gap-1 text-[10px]"
              title="Open / Import Saved Pipeline .ewf/.json File"
            >
              <FolderUp className="w-3.5 h-3.5" /> Open
            </button>
            <input type="file" accept=".ewf,.json" ref={importFileInputRef} onChange={handleImportWorkflow} className="hidden" />
          </div>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 text-[11px] font-semibold text-teal-300 bg-teal-950/40 hover:bg-teal-950 border border-teal-900 px-2.5 py-1 rounded transition-all"
            title="Upload CSV / TSV / Excel binary sheet"
          >
            <Upload className="w-3 h-3 text-teal-400" /> Parse Spreadsheet
          </button>
          <input type="file" accept=".xlsx,.xls,.xlsm,.xlsb,.csv,.tsv,.ods" ref={fileInputRef} onChange={(e) => handleSpreadsheetUpload(e.target.files[0])} className="hidden" />
          
          <button 
            onClick={handleExportData}
            disabled={!activeNode?.outputData}
            className="flex items-center gap-1 text-[11px] font-bold text-white bg-teal-700 hover:bg-teal-600 disabled:bg-teal-950/40 disabled:text-teal-900 px-3 py-1 rounded shadow transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Export Node
          </button>
        </div>
      </header>

      {/* PLATFORM WORKSPACE */}
      <div className="flex-1 flex overflow-hidden bg-[#050e10]">
        
        {/* LEFT PALETTE & FILE MANAGER */}
        <aside className={`bg-[#06191c] border-r border-teal-950/60 flex flex-col z-10 flex-shrink-0 transition-all duration-200 ease-in-out ${leftPanelCollapsed ? 'w-12' : 'w-[17.5rem]'}`}>
          {leftPanelCollapsed ? (
            <div className="flex flex-col items-center py-3 gap-6 h-full w-full">
              <button 
                onClick={() => setLeftPanelCollapsed(false)}
                className="p-1 hover:bg-teal-950 rounded text-teal-400 transition-transform"
                title="Expand Tool Palette"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="h-px w-6 bg-teal-950" />
              <div className="flex flex-col gap-5 items-center flex-1">
                <Database className="w-5 h-5 text-teal-400" />
                <Sliders className="w-5 h-5 text-orange-400" />
                <GitMerge className="w-5 h-5 text-amber-500" />
                <Hash className="w-5 h-5 text-cyan-400" />
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
            </div>
          ) : (
            <>
              {/* DRAG-AND-DROP FILE UPLOADER */}
              <div className="p-3 border-b border-teal-950 bg-[#071d20]/50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-[10px] font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-orange-500" /> Drag & Drop Hub
                  </h3>
                  <button 
                    onClick={() => setLeftPanelCollapsed(true)} 
                    className="p-1 hover:bg-teal-950 rounded text-teal-500"
                    title="Minimize Palette"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                <div 
                  className="border border-dashed border-teal-900 hover:border-orange-500/70 bg-[#050e10] rounded-lg p-3 text-center transition-all cursor-pointer relative"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.length) {
                      handleSpreadsheetUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-5 h-5 mx-auto text-teal-500 mb-1" />
                  <span className="text-[9px] text-teal-300 block font-semibold">Drop Excel, CSV, TSV here</span>
                  <span className="text-[8px] text-teal-600 block mt-0.5">OR click to browse</span>
                  
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="absolute inset-0 bg-teal-950/90 rounded-lg flex flex-col items-center justify-center p-2">
                      <div className="w-full bg-teal-900/60 rounded-full h-1.5 mb-1 overflow-hidden">
                        <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${uploadProgress}%` }} />
                      </div>
                      <span className="text-[8px] font-mono text-teal-400">Parsing... {uploadProgress}%</span>
                    </div>
                  )}
                </div>

                {uploadError && (
                  <div className="mt-2 p-1.5 bg-red-950/50 border border-red-900/40 rounded text-[9px] text-red-400 flex items-start gap-1">
                    <AlertTriangle className="w-3 h-3 shrink-0 text-red-500 mt-0.5" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>

              {/* SHEET VIEWER & REGISTER PREVIEW PANEL */}
              {uploadedWorkbook && (
                <div className="p-3 border-b border-teal-950 bg-teal-950/20 max-h-48 overflow-y-auto custom-scrollbar">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-bold text-orange-400 truncate w-40">{uploadedWorkbook.fileName}</span>
                    <button 
                      onClick={() => setUploadedWorkbook(null)}
                      className="text-teal-600 hover:text-red-400 p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-[8px] text-teal-500 mb-2 font-mono flex gap-2">
                    <span>Size: {uploadedWorkbook.fileSize}</span>
                    <span>Sheets: {uploadedWorkbook.sheets.length}</span>
                  </div>

                  <div className="space-y-1">
                    {uploadedWorkbook.sheets.map((sh, idx) => (
                      <div key={idx} className="flex items-center justify-between p-1 bg-[#050e10] rounded border border-teal-900/60 text-[9px]">
                        <div className="truncate w-32 font-mono text-teal-300 text-[8.5px]">
                          📄 {sh.sheetName} <span className="text-[8px] text-teal-500">({sh.data.length}r)</span>
                        </div>
                        <button 
                          onClick={() => importSheetToCatalog(sh, uploadedWorkbook.fileName)}
                          className="text-[8px] bg-orange-600 hover:bg-orange-500 text-white px-1.5 py-0.5 rounded flex items-center gap-0.5 font-bold uppercase transition-all"
                          title="Import this sheet into catalog as Input node"
                        >
                          <Plus className="w-2.5 h-2.5" /> Import
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* REGISTERED MEMORY DATABASE CATALOG */}
              <div className="p-2 border-b border-teal-950 bg-teal-950/10">
                <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest block mb-1">In-Memory Catalogs</span>
                <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                  {datasets.map(ds => (
                    <div key={ds.id} className={`text-[10px] flex items-center justify-between p-1.5 rounded bg-[#050e10] border ${ds.needsRelink ? 'border-red-900/50' : 'border-teal-950'} hover:border-teal-800 transition-colors`}>
                      <div className="flex items-center gap-1 truncate max-w-[170px]">
                        {ds.needsRelink ? (
                           <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" title="File not found in local cache. Please re-upload workbook to relink data." />
                        ) : (
                           <Database className="w-3 h-3 text-teal-400 shrink-0" />
                        )}
                        <span className={`truncate ${ds.needsRelink ? 'text-red-300' : 'text-teal-200'} font-mono text-[9px]`} title={ds.name}>{ds.name}</span>
                      </div>
                      <span className="text-[8px] bg-teal-950 text-teal-400 px-1 py-0.2 rounded font-mono">
                        {ds.data ? ds.data.length : 0}r
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEARCH TOOLS & TRANSFORM ENGINE NODES */}
              <div className="p-3 border-b border-teal-950 bg-[#050e10]/40">
                <div className="relative">
                  <Search className="w-3 h-3 text-teal-600 absolute left-2 top-2.5" />
                  <input 
                    type="text" 
                    placeholder="Search tools & steps..."
                    className="w-full bg-[#050e10] border border-teal-950 rounded py-1 pl-6 pr-3 text-[11px] text-teal-200 placeholder-teal-600 focus:outline-none focus:border-teal-800 font-medium"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3.5 custom-scrollbar">
                {Object.keys(TOOL_CATEGORIES).map(catKey => {
                  const category = TOOL_CATEGORIES[catKey];
                  const categoryTools = filteredTools.filter(t => t.category === catKey);
                  if (categoryTools.length === 0) return null;

                  return (
                    <div key={catKey} className="space-y-1">
                      <h3 className={`text-[8px] font-bold uppercase tracking-widest border-b pb-0.5 ${category.color}`}>
                        {category.name}
                      </h3>
                      <div className="grid grid-cols-1 gap-1">
                        {categoryTools.map(tool => {
                          const Icon = tool.icon;
                          return (
                            <button 
                              key={tool.id}
                              draggable
                              onDragStart={(e) => handleDragStartFromPalette(e, tool.id)}
                              onClick={() => handleToolDropOrClick(tool.id)}
                              className="flex items-center justify-between p-1.5 bg-[#050e10]/60 hover:bg-[#071d20]/90 border border-teal-950 hover:border-teal-900 rounded text-left group cursor-grab active:cursor-grabbing transition-all"
                            >
                              <div className="flex items-center gap-2">
                                <div className={`p-1 rounded text-white ${tool.color.split(' ')[0]}`}>
                                  <Icon className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-[11px] text-teal-300 group-hover:text-orange-400 transition-colors font-medium">
                                  {tool.name}
                                </span>
                              </div>
                              <span className="text-[9px] text-teal-800 group-hover:text-teal-400 font-bold font-mono">+</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </aside>

        {/* WORKFLOW CANVAS CONTAINER */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#050e10] relative">
          
          {/* ZOOM & CONTROLS METRIC */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-[#06191c] border border-teal-950 px-2 py-1 rounded shadow-lg">
            <button onClick={() => setCanvasZoom(prev => Math.max(0.5, prev - 0.1))} className="p-1 hover:bg-teal-950 rounded text-teal-400 hover:text-orange-500" title="Zoom Out"><ZoomOut className="w-3.5 h-3.5" /></button>
            <span className="text-[9px] font-mono font-bold text-teal-300 w-10 text-center">{Math.round(canvasZoom * 100)}%</span>
            <button onClick={() => setCanvasZoom(prev => Math.min(2, prev + 0.1))} className="p-1 hover:bg-teal-950 rounded text-teal-400 hover:text-orange-500" title="Zoom In"><ZoomIn className="w-3.5 h-3.5" /></button>
            <div className="h-3 w-px bg-teal-900/40 mx-0.5" />
            <button onClick={() => { setCanvasOffset({ x: 30, y: 30 }); setCanvasZoom(1); }} className="p-1 hover:bg-teal-950 rounded text-teal-400 hover:text-orange-500" title="Reset View"><Maximize2 className="w-3.5 h-3.5" /></button>
            <button onClick={handleAutoLayout} className="p-1 hover:bg-teal-950 rounded text-teal-400 hover:text-pink-500 transition-colors" title="Auto Layout"><Wand2 className="w-3.5 h-3.5" /></button>
            <div className="h-3 w-px bg-teal-900/40 mx-0.5" />
            <button onClick={() => alignSelectedNodes('left')} className="p-1 hover:bg-teal-950 rounded text-teal-400 hover:text-sky-400" title="Align Left"><AlignLeft className="w-3.5 h-3.5" /></button>
            <button onClick={() => alignSelectedNodes('right')} className="p-1 hover:bg-teal-950 rounded text-teal-400 hover:text-sky-400" title="Align Right"><AlignRight className="w-3.5 h-3.5" /></button>
            <button onClick={() => alignSelectedNodes('top')} className="p-1 hover:bg-teal-950 rounded text-teal-400 hover:text-sky-400" title="Align Top"><AlignStartVertical className="w-3.5 h-3.5" /></button>
            <button onClick={() => alignSelectedNodes('bottom')} className="p-1 hover:bg-teal-950 rounded text-teal-400 hover:text-sky-400" title="Align Bottom"><AlignEndVertical className="w-3.5 h-3.5" /></button>
            <div className="h-3 w-px bg-teal-900/40 mx-0.5" />
            <button onClick={() => { if (selectedNodeId) toggleNodeDisabled(selectedNodeId); }} className="p-1 hover:bg-teal-950 rounded text-teal-400 hover:text-amber-400" title="Disable/Enable Node"><EyeOff className="w-3.5 h-3.5" /></button>
            <button onClick={validateWorkflow} className="p-1 hover:bg-teal-950 rounded text-teal-400 hover:text-green-400" title="Validate Workflow"><ShieldCheck className="w-3.5 h-3.5" /></button>
          </div>

          {/* CANVAS NODE SEARCH */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-[#06191c] border border-teal-950 px-2 py-1 rounded shadow-lg">
            <Search className="w-3 h-3 text-teal-600" />
            <input
              type="text"
              placeholder="Find node..."
              className="bg-transparent border-none text-[10px] text-teal-200 placeholder-teal-700 w-24 focus:outline-none font-mono"
              value={canvasSearchQuery}
              onChange={e => setCanvasSearchQuery(e.target.value)}
            />
          </div>

          {/* VALIDATION RESULTS */}
          {validationResults.length > 0 && (
            <div className="absolute top-12 left-3 z-10 bg-[#06191c] border border-teal-950 rounded shadow-xl p-2 max-w-80 max-h-40 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-bold text-amber-400">Validation Results ({validationResults.length})</span>
                <button onClick={() => setValidationResults([])} className="text-teal-600 hover:text-red-400"><X className="w-3 h-3" /></button>
              </div>
              {validationResults.map((v, i) => (
                <div key={i} className={`text-[8px] py-0.5 font-mono ${v.type === 'error' ? 'text-red-400' : 'text-amber-400'}`}>
                  {v.type === 'error' ? '❌' : '⚠️'} {v.msg}
                </div>
              ))}
            </div>
          )}

          <div 
            ref={canvasRef}
            className={`flex-1 relative overflow-hidden select-none cursor-grab ${isDraggingCanvas ? 'cursor-grabbing' : ''}`}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onDragOver={handleCanvasDragOver}
            onDrop={handleDropOnCanvas}
          >
            {/* CANVAS GRID ACCENT BACKGROUND */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, #0d9488 1px, transparent 1.5px)',
                backgroundSize: '24px 24px',
                backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`
              }}
            />

            {/* UNIFIED GRAPH WORKSPACE */}
            <div 
              className="absolute inset-0 origin-top-left font-sans"
              style={{
                transform: `translate3d(${canvasOffset.x}px, ${canvasOffset.y}px, 0) scale(${canvasZoom})`,
              }}
            >
              
              {/* RENDER GROUPS */}
              {groups.map(g => {
                const groupNodes = nodes.filter(n => g.nodeIds.includes(n.id));
                if (groupNodes.length === 0) return null;
                
                const minX = Math.min(...groupNodes.map(n => n.position.x));
                const minY = Math.min(...groupNodes.map(n => n.position.y));
                const maxX = Math.max(...groupNodes.map(n => n.position.x + 180));
                const maxY = Math.max(...groupNodes.map(n => n.position.y + 100));
                
                return (
                  <div
                    key={g.id}
                    className="absolute bg-teal-900/10 border border-teal-500/30 rounded-xl pointer-events-none"
                    style={{
                      left: minX - 20,
                      top: minY - 20,
                      width: maxX - minX + 40,
                      height: maxY - minY + 40
                    }}
                  />
                );
              })}

              {/* COMPILER EDGE SVG CONNECTIONS */}
              <svg className="absolute inset-0 overflow-visible pointer-events-none z-0">
                <defs>
                  <linearGradient id="edge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0d9488" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.8" />
                  </linearGradient>
                  <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#f97316" />
                  </marker>
                </defs>

                {connectingFrom && mouseCanvasPos && (() => {
                  const fromCoord = getPortCoordinates(connectingFrom.nodeId, connectingFrom.portId);
                  const toCoord = mouseCanvasPos;
                  const pathString = getBezierPath(fromCoord, toCoord);
                  return (
                    <path 
                      d={pathString}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="3.5"
                      strokeDasharray="6 6"
                      className="animate-flow-dash opacity-90"
                      style={{ pointerEvents: 'none' }}
                    />
                  );
                })()}

                {edges.map(edge => {
                  const fromCoord = getPortCoordinates(edge.from, edge.fromPort);
                  const toCoord = getPortCoordinates(edge.to, edge.toPort);
                  const pathString = getBezierPath(fromCoord, toCoord);

                  return (
                    <g key={edge.id} className="group pointer-events-auto cursor-pointer">
                      <path 
                        d={pathString}
                        fill="none"
                        stroke="transparent"
                        strokeWidth="12"
                        className="cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); deleteEdge(edge.id); }}
                      />
                      <path 
                        d={pathString}
                        fill="none"
                        stroke="url(#edge-grad)"
                        strokeWidth="2.5"
                        className="group-hover:stroke-orange-500 transition-colors animate-pulse"
                        markerEnd="url(#arrow)"
                      />
                      <circle 
                        cx={(fromCoord.x + toCoord.x) / 2} 
                        cy={(fromCoord.y + toCoord.y) / 2} 
                        r="5" 
                        className="fill-[#050e10] stroke-teal-500 cursor-pointer hover:fill-red-500 hover:stroke-red-300 transition-colors"
                        onClick={(e) => { e.stopPropagation(); deleteEdge(edge.id); }}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* TRANSLATION INTERACTIVE BLOCKS */}
              <div className="absolute inset-0 pointer-events-none z-10">
                {nodes.map(node => {
                  const meta = NODE_TYPES[node.type] || NODE_TYPES.INPUT;
                  const Icon = meta.icon;
                  const isSelected = node.id === selectedNodeId;

                  let nodeColorStyles = "hover:border-teal-700/60";
                  const isSearchMatch = canvasSearchQuery && (meta.name.toLowerCase().includes(canvasSearchQuery.toLowerCase()) || node.id.toLowerCase().includes(canvasSearchQuery.toLowerCase()));
                  
                  if (node.disabled) {
                    nodeColorStyles = "opacity-40 border-slate-700 grayscale";
                  } else if (isSelected) {
                    if (node.status === 'error') nodeColorStyles = "glow-node-red border-red-500";
                    else if (node.type === 'INPUT') nodeColorStyles = "glow-node-teal border-teal-500";
                    else if (node.type === 'OUTPUT') nodeColorStyles = "glow-node-emerald border-emerald-500";
                    else if (node.type === 'LOOKUP' || node.type === 'JOIN' || node.type === 'UNION') nodeColorStyles = "glow-node-amber border-amber-500";
                    else if (node.type === 'FILTER') nodeColorStyles = "glow-node-cyan border-cyan-500";
                    else nodeColorStyles = "glow-node-orange border-orange-500";
                  } else if (isSearchMatch) {
                    nodeColorStyles = "border-yellow-500 ring-2 ring-yellow-500/40";
                  }

                  let statusBadge = null;
                  if (node.status === 'success') {
                    statusBadge = (
                      <button 
                        onClick={(e) => { e.stopPropagation(); runNodeLocally(node.id); }}
                        className="badge-action flex items-center gap-1 text-[8px] font-bold text-teal-400 bg-teal-950/80 px-1.5 py-0.5 rounded border border-teal-500/30 hover:bg-teal-900 transition-all cursor-pointer"
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3px]" /> OK
                      </button>
                    );
                  } else if (node.status === 'error') {
                    statusBadge = (
                      <button 
                        onClick={(e) => { e.stopPropagation(); runNodeLocally(node.id); }}
                        className="badge-action flex items-center gap-1 text-[8px] font-bold text-red-400 bg-red-950/80 px-1.5 py-0.5 rounded border border-red-500/30 animate-pulse hover:bg-red-900 transition-all cursor-pointer hover:glow-node-red"
                      >
                        <AlertTriangle className="w-2.5 h-2.5" /> ERR
                      </button>
                    );
                  } else if (node.status === 'running') {
                    statusBadge = (
                      <span className="flex items-center gap-1 text-[8px] font-bold text-orange-400 bg-orange-950/80 px-1.5 py-0.5 rounded border border-orange-500/30">
                        <RefreshCcw className="w-2.5 h-2.5 animate-spin" /> RUN
                      </span>
                    );
                  } else if (node.status === 'stale') {
                    statusBadge = (
                      <button 
                        onClick={(e) => { e.stopPropagation(); runNodeLocally(node.id); }}
                        className="badge-action flex items-center gap-1 text-[8px] font-bold text-orange-400 bg-orange-950/80 px-1.5 py-0.5 rounded border border-orange-500/30 hover:bg-orange-900 transition-all cursor-pointer" 
                      >
                        <RefreshCw className="w-2.5 h-2.5" /> SYNC
                      </button>
                    );
                  } else {
                    statusBadge = (
                      <button 
                        onClick={(e) => { e.stopPropagation(); runNodeLocally(node.id); }}
                        className="badge-action flex items-center gap-1 text-[8px] font-bold text-teal-400 bg-[#06191c] px-1.5 py-0.5 rounded border border-teal-800/60 hover:bg-teal-950 transition-all cursor-pointer"
                      >
                        ▶ Run
                      </button>
                    );
                  }

                  const nodeFormulaRepresentation = node.outputData?.formula || getLiveFormulaRepresentation(node, upstreamColsForActiveNode);

                  return (
                    <div
                      key={node.id}
                      style={{
                        transform: `translate3d(${node.position.x}px, ${node.position.y}px, 0)`,
                      }}
                      onMouseDown={(e) => handleNodeDragStart(e, node.id)}
                      className={`absolute w-44 p-2.5 rounded-lg border-2 pointer-events-auto cursor-grab transition-all flow-node bg-[#06191c]/95 select-none shadow-xl ${nodeColorStyles}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className={`p-1 rounded text-white ${meta.color.split(' ')[0]}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-teal-100 truncate w-24">
                              {meta.name}
                            </h4>
                            <span className="text-[7.5px] font-mono text-teal-600 block">
                              {node.id.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteSelectedNode(node.id); }}
                          className="text-teal-600 hover:text-red-400 p-0.5 rounded transition-colors"
                        >
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>

                      {node.type === 'COMMENT' ? (
                        <div className="mt-2 p-1.5 bg-[#050e10] border border-teal-950 rounded font-sans text-[10px] text-teal-200 whitespace-pre-wrap break-words min-h-[40px] max-h-[120px] overflow-hidden">
                          {node.config?.text || 'Double-click or use Properties pane to add notes.'}
                        </div>
                      ) : (
                        <>
                          {/* EXCEL FORMULA CARD DISPLAY */}
                          <div className="mt-1.5 px-1.5 py-1 bg-[#050e10] border border-teal-950 rounded font-mono text-[8px] text-teal-400 truncate tracking-tight" title={nodeFormulaRepresentation}>
                            {nodeFormulaRepresentation}
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-[8.5px] text-teal-500 bg-[#050e10] px-1 py-0.5 rounded font-mono truncate max-w-[100px]">
                              {node.type === 'INPUT' && node.config?.dataset ? node.config.dataset.name : ''}
                              {node.type === 'FILTER' && node.config?.column ? `${node.config.column} ${node.config.operator} ${node.config.value || ''}` : ''}
                              {node.type === 'SELECT' && node.config?.selectedColumns ? `${node.config.selectedColumns.length} fields` : ''}
                              {node.type === 'SORT' && node.config?.column ? `Sort: ${node.config.column}` : ''}
                              {node.type === 'CONCAT' && node.config?.outputField ? `Concat: ${node.config.outputField}` : ''}
                              {node.type === 'FORMULA' && node.config?.newColumnName ? `Col: ${node.config.newColumnName}` : ''}
                              {node.type === 'LOOKUP' && node.config?.baseKey ? `Match: ${node.config.baseKey}` : ''}
                              {node.type === 'JOIN' && node.config?.leftKey ? `Join: ${node.config.leftKey}` : ''}
                              {node.type === 'UID' && node.config?.columnName ? `UID: ${node.config.columnName}` : ''}
                              {node.type === 'TEXTSPLIT' && node.config?.mode === 'increment' ? `Inc: ${node.config.targetColumn || 'AutoInc'}` : ''}
                              {node.type === 'TEXTSPLIT' && node.config?.mode !== 'increment' && node.config?.column ? `Split: ${node.config.column}` : ''}
                              {node.type === 'UNION' ? 'Merge Stack' : ''}
                              {node.type === 'SAMPLE' && node.config?.mode ? `Sample: ${node.config.mode}` : ''}
                              {node.type === 'FIND_REPLACE' && node.config?.targetColumn ? `Replace: ${node.config.targetColumn}` : ''}
                              {node.type === 'MULTI_ROW' && node.config?.newColumnName ? `RowForm: ${node.config.newColumnName}` : ''}
                              {node.type === 'REGEX' && node.config?.column ? `Regex: ${node.config.column}` : ''}
                              {node.type === 'TEXT_TO_COLUMNS' && node.config?.column ? `T2C: ${node.config.column}` : ''}
                              {node.type === 'TRANSPOSE' ? 'Wide to Long' : ''}
                              {node.type === 'CROSSTAB' ? 'Long to Wide' : ''}
                              {node.type === 'APPEND' ? 'Cartesian Join' : ''}
                              {node.type === 'BROWSE' ? 'Profile Data' : ''}
                              {node.type === 'AUTO_FIELD' ? 'Auto Detect' : ''}
                              {node.type === 'FIELD_INFO' ? 'Field Catalog' : ''}
                              {node.type === 'FUZZY_MATCH' && node.config?.leftKey ? `Fuzzy: ${node.config.leftKey}` : ''}
                              {node.type === 'JOIN_MULTIPLE' && node.config?.leftKey ? `Multi: ${node.config.leftKey}` : ''}
                              {node.type === 'XML_PARSE' && node.config?.sourceColumn ? `XML: ${node.config.sourceColumn}` : ''}
                              {node.type === 'JSON_PARSE' && node.config?.sourceColumn ? `JSON: ${node.config.sourceColumn}` : ''}
                              {node.type === 'DYNAMIC_RENAME' ? `Rename: ${node.config?.renameMode || 'prefix'}` : ''}
                              {node.type === 'RUNNING_TOTAL' && node.config?.valueColumn ? `RT: ${node.config.valueColumn}` : ''}
                              {node.type === 'TILE' && node.config?.column ? `Tile: ${node.config.column}` : ''}
                              {node.type === 'CHARTING' ? `Chart: ${node.config?.chartType || 'bar'}` : ''}
                              {node.type === 'REPORT_TEXT' ? 'Report' : ''}
                              {node.type === 'SPATIAL_POINT' ? 'Lat/Lon Points' : ''}
                              {node.type === 'DISTANCE_CALC' ? 'Haversine' : ''}
                              {node.type === 'SPATIAL_MATCH' ? 'Spatial Join' : ''}
                              {node.type === 'BUFFER' ? `Buffer: ${node.config?.radius || 1}km` : ''}
                              {node.type === 'AREA_CALC' ? 'Area Calc' : ''}
                              {node.type === 'LOGISTIC_REGRESSION' && node.config?.targetColumn ? `LogReg: ${node.config.targetColumn}` : ''}
                              {node.type === 'RANDOM_FOREST' && node.config?.targetColumn ? `RF: ${node.config.targetColumn}` : ''}
                            </div>
                            {statusBadge}
                          </div>
                        </>
                      )}

                      {/* PORT DOT LAYOUTS */}
                      {meta.inputs === 1 && (
                        <div 
                          data-node-id={node.id}
                          data-port-id="in"
                          onMouseDown={(e) => handlePortInteraction(e, node.id, 'in')}
                          className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-orange-600 border-2 border-[#06191c] port-dot port-dot-input cursor-pointer hover:scale-125 transition-transform"
                          title="Input Stream"
                        />
                      )}
                      {meta.inputs === 2 && (
                        <>
                          <div 
                            data-node-id={node.id}
                            data-port-id="in1"
                            onMouseDown={(e) => handlePortInteraction(e, node.id, 'in1')}
                            className="absolute -left-1.5 top-1/3 -translate-y-1/2 w-3 h-3 rounded-full bg-teal-500 border-2 border-[#06191c] port-dot port-dot-input cursor-pointer hover:scale-125 transition-transform"
                            title="Left Target Stream"
                          />
                          <div 
                            data-node-id={node.id}
                            data-port-id="in2"
                            onMouseDown={(e) => handlePortInteraction(e, node.id, 'in2')}
                            className="absolute -left-1.5 top-2/3 -translate-y-1/2 w-3 h-3 rounded-full bg-amber-500 border-2 border-[#06191c] port-dot port-dot-input cursor-pointer hover:scale-125 transition-transform"
                            title="Right Target Stream"
                          />
                        </>
                      )}

                      {meta.outputs === 1 && (
                        <div 
                          onPointerDown={(e) => handlePortPointerDown(e, node.id, 'out')}
                          onMouseDown={(e) => handlePortInteraction(e, node.id, 'out')}
                          className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-orange-600 border-2 border-[#06191c] port-dot cursor-pointer hover:scale-125 transition-transform"
                          title="Output Stream"
                        />
                      )}
                    </div>
                  );
                })}

                {connectingFrom && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-orange-600 border border-orange-400 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-2xl animate-bounce pointer-events-none z-10 flex items-center gap-1.5">
                    <GitMerge className="w-3.5 h-3.5 animate-spin" /> Link to another block input port to compile wire.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MINI MAP */}
          <div className="absolute bottom-4 right-4 bg-[#06191c]/90 border border-teal-950/60 rounded overflow-hidden shadow-2xl z-10 pointer-events-none" style={{ width: 160, height: 120 }}>
            {nodes.map(n => (
              <div 
                key={`mini_${n.id}`}
                className="absolute bg-teal-500/50 rounded-sm"
                style={{
                  left: (n.position.x / 40) + 80,
                  top: (n.position.y / 40) + 60,
                  width: 4,
                  height: 3
                }}
              />
            ))}
            <div 
              className="absolute border border-orange-500/50 bg-orange-500/10"
              style={{
                left: (-canvasOffset.x / canvasZoom / 40) + 80,
                top: (-canvasOffset.y / canvasZoom / 40) + 60,
                width: 160 / canvasZoom,
                height: 120 / canvasZoom
              }}
            />
          </div>

          {/* TABULAR LIVE TELEMETRY PREVIEW PANEL */}
          <div className={`bg-[#050e10] border-t border-teal-950/60 flex flex-col z-10 flex-shrink-0 transition-all duration-200 ease-in-out ${previewPanelCollapsed ? 'h-10' : 'h-64'}`}>
            <div 
              className="px-4 py-2 bg-[#06191c] border-b border-teal-950 flex justify-between items-center cursor-pointer select-none"
              onClick={() => setPreviewPanelCollapsed(!previewPanelCollapsed)}
            >
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-bold text-teal-300 flex items-center gap-2">
                  <PlayCircle className="w-3.5 h-3.5 text-orange-500" />
                  Live Flow Preview: {activeNode ? NODE_TYPES[activeNode.type].name : 'Choose node'}
                </h3>
                {activeNode?.outputData?.chartData && !previewPanelCollapsed && (
                  <div className="flex items-center bg-[#050e10] border border-teal-950/60 rounded p-0.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreviewTab('table'); }}
                      className={`px-2.5 py-0.5 text-[10px] font-semibold rounded transition-all ${previewTab === 'table' ? 'bg-teal-900/60 text-teal-200 border border-teal-700/40' : 'text-teal-500 hover:text-teal-300 border border-transparent'}`}
                    >
                      Table View
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreviewTab('chart'); }}
                      className={`px-2.5 py-0.5 text-[10px] font-semibold rounded transition-all ${previewTab === 'chart' ? 'bg-teal-900/60 text-teal-200 border border-teal-700/40' : 'text-teal-500 hover:text-teal-300 border border-transparent'}`}
                    >
                      Chart View
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                {activeNode?.outputData && !previewPanelCollapsed && (
                  <span className="text-[9px] font-bold bg-teal-950 text-teal-400 border border-teal-900 px-2 py-0.5 rounded font-mono">
                    Total: {activeNode.outputData.data.length} records processed
                  </span>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); setPreviewPanelCollapsed(!previewPanelCollapsed); }}
                  className="p-1 hover:bg-teal-950 rounded text-teal-400 hover:text-white"
                >
                  {previewPanelCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            {!previewPanelCollapsed && (
              <div className="flex-1 overflow-auto bg-[#050e10] p-0 custom-scrollbar">
                {!activeNode ? (
                  <div className="h-full flex flex-col items-center justify-center text-teal-600 text-xs">
                    <Sliders className="w-8 h-8 mb-1.5 opacity-30 text-orange-500" />
                    Select any block in the pipeline grid above to audit live compiled tables.
                  </div>
                ) : activeNode.status === 'running' ? (
                  <div className="h-full flex flex-col items-center justify-center text-teal-600 text-xs p-4">
                    <RefreshCcw className="w-8 h-8 mb-1.5 opacity-40 text-orange-500 animate-spin" />
                    Executing node pipeline...
                  </div>
                ) : activeNode.outputData?.errors && activeNode.outputData.errors.length > 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-red-400 text-xs p-4 bg-red-950/10 border border-red-950/20 rounded">
                    <AlertTriangle className="w-8 h-8 mb-1.5 opacity-60 text-red-500 animate-bounce" />
                    <div className="font-bold text-red-300 mb-1">Execution Error:</div>
                    <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-red-200">
                      {activeNode.outputData.errors.map((err, eIdx) => (
                        <li key={eIdx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                ) : !activeNode.outputData || activeNode.outputData.data.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-teal-600 text-xs p-4">
                    <AlertTriangle className="w-8 h-8 mb-1.5 opacity-40 text-orange-500 animate-pulse" />
                    No data running in current block context. Run the pipeline to populate results.
                  </div>
                ) : previewTab === 'chart' && activeNode.outputData.chartData ? (
                  <div className="p-4 max-w-2xl mx-auto h-full overflow-y-auto custom-scrollbar">
                    <WorkflowChart chartData={activeNode.outputData.chartData} />
                  </div>
                ) : (
                  <VirtualTable 
                    key={`${activeNode.id}_${activeNode.lastRunTime || 'none'}`}
                    data={activeNode.outputData.data} 
                    columns={activeNode.outputData.columns} 
                  />
                )}
              </div>
            )}
          </div>
        </main>

        {/* RIGHT SIDEBAR: PROPERTIES & EXCEL TRANSLATOR */}
        <aside className={`bg-[#06191c] border-l border-teal-950/60 flex flex-col z-20 flex-shrink-0 transition-all duration-200 ease-in-out ${rightPanelCollapsed ? 'w-12' : 'w-[20rem]'}`}>
          {rightPanelCollapsed ? (
            <div className="flex flex-col items-center py-3 gap-6 h-full w-full">
              <button 
                onClick={() => setRightPanelCollapsed(false)}
                className="p-1 hover:bg-teal-950 rounded text-teal-400 transition-transform"
                title="Expand Configuration"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="h-px w-6 bg-teal-950" />
              <button onClick={() => { setRightPanelCollapsed(false); setActiveTab('properties'); }} className="text-teal-400"><Settings className="w-5 h-5" /></button>
              <button onClick={() => { setRightPanelCollapsed(false); setActiveTab('logs'); }} className="text-orange-500"><Terminal className="w-5 h-5" /></button>
            </div>
          ) : (
            <>
              <div className="flex items-center border-b border-teal-950 bg-[#06191c]">
                <button 
                  onClick={() => setRightPanelCollapsed(true)} 
                  className="p-3 hover:bg-teal-950 text-teal-400 border-r border-teal-950"
                  title="Collapse Panel"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-2 text-center text-[10px] font-bold tracking-widest flex-1 uppercase">
                  <button 
                    onClick={() => setActiveTab('properties')}
                    className={`py-3.5 ${activeTab === 'properties' ? 'text-orange-500 border-b-2 border-orange-500 bg-[#050e10]/40' : 'text-teal-400'}`}
                  >
                    Properties
                  </button>
                  <button 
                    onClick={() => setActiveTab('logs')}
                    className={`py-3.5 ${activeTab === 'logs' ? 'text-teal-300 border-b-2 border-teal-400 bg-[#050e10]/40' : 'text-teal-500 hover:text-teal-300'}`}
                  >
                    Engine Logs
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar bg-[#06191c]">
                
                {activeTab === 'properties' && (
                  <div className="space-y-4">
                    {!activeNode ? (
                      <div className="text-center py-10 text-teal-600 text-xs">
                        <Info className="w-7 h-7 mx-auto mb-2 text-teal-700" />
                        Select a workspace block to configure parameters.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-teal-950">
                          <h3 className="text-[11px] font-bold text-teal-100 uppercase">{NODE_TYPES[activeNode.type].name}</h3>
                          <span className="text-[8px] bg-teal-950 text-teal-400 px-1.5 py-0.5 rounded font-mono">{activeNode.id}</span>
                        </div>

                        {/* AUTO-SAVE STATUS PANEL IN CONFIGURATION */}
                        <div className="p-2.5 bg-[#050e10] border border-teal-950 rounded-lg flex items-center justify-between">
                          <span className="text-[9px] uppercase font-bold text-teal-400">Auto Save Changes</span>
                          <input 
                            type="checkbox"
                            checked={autoSaveEnabled}
                            onChange={(e) => {
                              setAutoSaveEnabled(e.target.checked);
                              setSystemLogs(prev => [...prev, `[Auto-Save Toggle] Automatically save updates is now ${e.target.checked ? 'ENABLED' : 'DISABLED'}`]);
                            }}
                            className="w-3.5 h-3.5 rounded bg-teal-950 text-orange-600 border-teal-900 focus:ring-0 cursor-pointer"
                          />
                        </div>

                        {activeNode.status === 'stale' && (
                          <div className="p-2 bg-orange-950/20 border border-orange-900/40 rounded text-[9.5px] text-orange-400 font-mono leading-relaxed">
                            ⚠️ This node contains uncompiled changes. Click Run Pipeline to compile!
                          </div>
                        )}

                        {activeNode.outputData?.explanation && (
                          <div className="p-2.5 bg-[#050e10] border border-teal-950 rounded text-[10px] text-teal-300">
                            <strong>Flow Explanation:</strong> {activeNode.outputData.explanation}
                          </div>
                        )}

                        {/* EXCEL FORMULA CARD PREVIEW */}
                        {activeNode.type !== 'FORMULA' && (
                          <div className="bg-[#050e10] border border-teal-950 rounded p-2.5 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] uppercase text-orange-500 font-bold tracking-wider">Visible Excel Formula</span>
                              <button 
                                onClick={() => {
                                  const formulaStr = getLiveFormulaRepresentation(activeNode, upstreamColsForActiveNode);
                                  document.execCommand('copy'); 
                                  navigator.clipboard?.writeText(formulaStr);
                                  setSystemLogs(prev => [...prev, "[Clipboard] Formula string saved."]);
                                }}
                                className="text-[9px] text-teal-500 hover:text-teal-300 flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3" /> Copy
                              </button>
                            </div>
                            <div className="p-1.5 bg-[#06191c] rounded font-mono text-[9.5px] text-teal-400 break-all">
                              {getLiveFormulaRepresentation(activeNode, upstreamColsForActiveNode)}
                            </div>
                          </div>
                        )}

                        {/* AUTO-MATCH FIELD UTILITY */}
                        {(activeNode.type === 'JOIN' || activeNode.type === 'LOOKUP') && (
                          <button
                            onClick={() => autoMatchJoinKeys(activeNode.id)}
                            className="w-full py-1.5 bg-[#050e10] hover:bg-teal-950 border border-teal-900 text-teal-300 hover:text-orange-400 text-[10px] font-bold rounded flex items-center justify-center gap-1 shadow-sm transition-all"
                            title="Auto scan attributes for case-insensitive matching identifiers"
                          >
                            <Wand2 className="w-3.5 h-3.5 text-orange-500" /> Auto-Match Join Keys ✨
                          </button>
                        )}

                        {/* BLOCK DYNAMIC INPUT PROPERTIES */}
                        {activeNode.type === 'INPUT' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Catalog Worksheet</label>
                            <select 
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none focus:border-orange-500 font-mono"
                              value={activeNode.config.dataset?.id || ''}
                              onChange={(e) => {
                                const ds = datasets.find(d => d.id === e.target.value);
                                updateNodeConfig(activeNode.id, 'dataset', ds);
                              }}
                            >
                              <option value="">-- Choose Worksheet --</option>
                              {datasets.map(ds => (
                                <option key={ds.id} value={ds.id}>{ds.name}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        {activeNode.type === 'FORMULA' && (
                          <div className="space-y-3">
                            <OutputFieldConfig node={activeNode} updateNodeConfig={updateNodeConfig} upstreamCols={upstreamColsForActiveNode} />

                            <div className="space-y-1">
                              <span className="text-[8px] uppercase font-bold text-teal-500">Add upstream attribute (click):</span>
                              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto p-1.5 bg-[#050e10] rounded border border-teal-950 custom-scrollbar">
                                {upstreamColsForActiveNode.map(c => (
                                  <button 
                                    key={c}
                                    onClick={() => {
                                      const curr = activeNode.config.customFormula || '';
                                      updateNodeConfig(activeNode.id, 'customFormula', curr + `[${c}]`);
                                    }}
                                    className="text-[8.5px] bg-[#06191c] hover:bg-orange-950/50 hover:text-orange-400 text-teal-300 border border-teal-900 px-1 rounded font-mono"
                                  >
                                    [{c}]
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[9px] text-teal-400 font-bold uppercase block">Alteryx Expression Compiler</span>
                              <textarea 
                                placeholder="Write Excel expressions... e.g. CONCAT(UPPER([CustomerName]), '-A')"
                                value={activeNode.config.customFormula || ''}
                                onChange={(e) => updateNodeConfig(activeNode.id, 'customFormula', e.target.value)}
                                className="w-full bg-[#050e10] text-teal-100 font-mono text-xs border border-teal-950 rounded p-2 h-20 focus:outline-none focus:border-orange-500"
                              />
                            </div>

                            {/* ASSISTANT FORMULA ENGINE CARD UTILITY */}
                            <div className="p-2 bg-[#050e10] border border-teal-950 rounded space-y-1 text-[10px] text-teal-300">
                              <div className="text-[8.5px] font-bold text-orange-500 uppercase">Quick Syntax Snippets</div>
                              <div className="grid grid-cols-1 gap-1 font-mono text-[8px]">
                                <button 
                                  onClick={() => updateNodeConfig(activeNode.id, 'customFormula', 'UPPER([CustomerID])')}
                                  className="bg-[#06191c] p-1 rounded text-teal-300 text-left"
                                >
                                  UPPER([Field])
                                </button>
                                <button 
                                  onClick={() => updateNodeConfig(activeNode.id, 'customFormula', 'CONCAT([CustomerID], "_", [Region])')}
                                  className="bg-[#06191c] p-1 rounded text-teal-300 text-left"
                                >
                                  CONCAT([Field1], "_", [Field2])
                                </button>
                                <button 
                                  onClick={() => updateNodeConfig(activeNode.id, 'customFormula', 'IF([SalesAmount] > 1000, "Enterprise", "Retail")')}
                                  className="bg-[#06191c] p-1 rounded text-teal-300 text-left"
                                >
                                  IF([Amount] &gt; 1000, "Enterprise", "Retail")
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CONCATENATE DEDICATED BLOCK CONFIGURATION PANEL */}
                        {activeNode.type === 'CONCAT' && (
                          <div className="space-y-4">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Configure Concatenate</label>
                            
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-teal-500 mb-1 font-bold">Select Combine Fields (Check to Add)</label>
                              <div className="space-y-1 bg-[#050e10] border border-teal-950 rounded p-2 max-h-32 overflow-y-auto custom-scrollbar">
                                {upstreamColsForActiveNode.length > 0 ? upstreamColsForActiveNode.map(col => {
                                  const list = activeNode.config.selectedFields || [];
                                  const isChecked = list.includes(col);
                                  return (
                                    <label key={col} className="flex items-center gap-2 text-[10px] font-mono text-teal-200 cursor-pointer">
                                      <input 
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => {
                                          const nextList = e.target.checked 
                                            ? [...list, col] 
                                            : list.filter(item => item !== col);
                                          updateNodeConfig(activeNode.id, 'selectedFields', nextList);
                                        }}
                                        className="rounded border-teal-900 bg-teal-950 text-orange-600 focus:ring-0"
                                      />
                                      <span>{col}</span>
                                    </label>
                                  );
                                }) : (
                                  <div className="text-[9px] text-teal-600 italic">No upstream fields connected.</div>
                                )}
                              </div>
                            </div>

                            {/* SORT/SEQUENCE ORDER CHIPS */}
                            {activeNode.config.selectedFields?.length > 0 && (
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider text-teal-500 font-bold mb-1">Sequence Order (First to Last)</label>
                                <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar bg-[#050e10] p-1.5 rounded border border-teal-950">
                                  {activeNode.config.selectedFields.map((field, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-[#06191c] px-2 py-1 rounded border border-teal-900 text-[10px] font-mono text-teal-200">
                                      <span className="truncate w-24">{field}</span>
                                      <div className="flex items-center gap-1">
                                        <button 
                                          onClick={() => {
                                            const list = [...activeNode.config.selectedFields];
                                            if (idx > 0) {
                                              [list[idx-1], list[idx]] = [list[idx], list[idx-1]];
                                              updateNodeConfig(activeNode.id, 'selectedFields', list);
                                            }
                                          }}
                                          className="text-teal-400 hover:text-orange-500 p-0.5"
                                        >
                                          <ArrowUp className="w-3 h-3" />
                                        </button>
                                        <button 
                                          onClick={() => {
                                            const list = [...activeNode.config.selectedFields];
                                            if (idx < list.length - 1) {
                                              [list[idx+1], list[idx]] = [list[idx], list[idx+1]];
                                              updateNodeConfig(activeNode.id, 'selectedFields', list);
                                            }
                                          }}
                                          className="text-teal-400 hover:text-orange-500 p-0.5"
                                        >
                                          <ArrowDown className="w-3 h-3" />
                                        </button>
                                        <button 
                                          onClick={() => {
                                            const list = activeNode.config.selectedFields.filter(f => f !== field);
                                            updateNodeConfig(activeNode.id, 'selectedFields', list);
                                          }}
                                          className="text-red-500 hover:text-red-300 p-0.5"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* SEPARATOR CONTROLLER */}
                            <div className="space-y-1">
                              <label className="block text-[9px] uppercase tracking-wider text-teal-400 font-bold">Separator Type</label>
                              <select 
                                className="w-full bg-[#050e10] border border-teal-950 rounded p-1 text-xs text-teal-200"
                                value={activeNode.config.separator || 'space'}
                                onChange={(e) => updateNodeConfig(activeNode.id, 'separator', e.target.value)}
                              >
                                <option value="space">Space (" ")</option>
                                <option value="dash">Dash ("-")</option>
                                <option value="underscore">Underscore ("_")</option>
                                <option value="custom">Custom Text Separator</option>
                              </select>
                            </div>

                            {activeNode.config.separator === 'custom' && (
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider text-teal-500 mb-1">Custom Separator Value</label>
                                <input 
                                  type="text"
                                  placeholder="e.g. , / | / *"
                                  value={activeNode.config.customSeparator || ''}
                                  onChange={(e) => updateNodeConfig(activeNode.id, 'customSeparator', e.target.value)}
                                  className="w-full bg-[#050e10] border border-teal-950 rounded px-2 py-1 text-xs text-teal-100 font-mono"
                                />
                              </div>
                            )}

                            {/* PREFIX & SUFFIX */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider text-teal-500 mb-1">Prefix</label>
                                <input 
                                  type="text"
                                  placeholder="e.g. ID_"
                                  value={activeNode.config.prefix || ''}
                                  onChange={(e) => updateNodeConfig(activeNode.id, 'prefix', e.target.value)}
                                  className="w-full bg-[#050e10] border border-teal-950 rounded px-2 py-1 text-xs text-teal-100"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider text-teal-500 mb-1">Suffix</label>
                                <input 
                                  type="text"
                                  placeholder="e.g. _INC"
                                  value={activeNode.config.suffix || ''}
                                  onChange={(e) => updateNodeConfig(activeNode.id, 'suffix', e.target.value)}
                                  className="w-full bg-[#050e10] border border-teal-950 rounded px-2 py-1 text-xs text-teal-100"
                                />
                              </div>
                            </div>

                            {/* ADVANCED TRIM OPTIONS */}
                            <div className="space-y-2 bg-[#050e10] p-2.5 rounded border border-teal-950 text-[10px]">
                              <span className="text-[8.5px] uppercase font-bold text-orange-500 tracking-wide block mb-1">Advanced Concat Rules</span>
                              
                              <label className="flex items-center gap-2 cursor-pointer text-teal-200">
                                <input 
                                  type="checkbox"
                                  checked={activeNode.config.trimSpaces !== false}
                                  onChange={(e) => updateNodeConfig(activeNode.id, 'trimSpaces', e.target.checked)}
                                  className="rounded border-teal-900 bg-teal-950 text-orange-600 focus:ring-0"
                                />
                                <span>Trim Extra Spaces & Clean text</span>
                              </label>

                              <label className="flex items-center gap-2 cursor-pointer text-teal-200">
                                <input 
                                  type="checkbox"
                                  checked={activeNode.config.ignoreBlank !== false}
                                  onChange={(e) => updateNodeConfig(activeNode.id, 'ignoreBlank', e.target.checked)}
                                  className="rounded border-teal-900 bg-teal-950 text-orange-600 focus:ring-0"
                                />
                                <span>Ignore Blank/Empty values</span>
                              </label>

                              <div className="space-y-1.5 mt-2">
                                <span className="text-[9px] text-teal-500">Case Transformation</span>
                                <select 
                                  className="w-full bg-[#06191c] border border-teal-900 text-teal-300 rounded p-1 text-[10px]"
                                  value={activeNode.config.caseConversion || 'none'}
                                  onChange={(e) => updateNodeConfig(activeNode.id, 'caseConversion', e.target.value)}
                                >
                                  <option value="none">No Casing Changes</option>
                                  <option value="upper">UPPERCASE (A-Z)</option>
                                  <option value="lower">lowercase (a-z)</option>
                                </select>
                              </div>
                            </div>

                            {/* DESTINATION FIELD */}
                            <OutputFieldConfig node={activeNode} updateNodeConfig={updateNodeConfig} upstreamCols={upstreamColsForActiveNode} />

                            {/* INSTANT CONCAT LIVE PREVIEW BLOCK */}
                            <div className="bg-[#050e10] border border-teal-950 rounded p-2.5 space-y-1.5">
                              <span className="text-[8.5px] uppercase text-orange-500 font-extrabold tracking-wider flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" /> Instant Preview (Top 3 Sample Rows)
                              </span>
                              <div className="space-y-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                                {(() => {
                                  const incoming = edges.find(e => e.to === activeNode.id);
                                  const parentNode = incoming ? nodes.find(n => n.id === incoming.from) : null;
                                  const rawRows = parentNode?.outputData?.data || [];
                                  if (rawRows.length === 0) {
                                    return <div className="text-[9px] text-teal-600 italic">No parent database rows to compile.</div>;
                                  }
                                  return rawRows.slice(0, 3).map((row, index) => {
                                    const combinedStr = previewConcatenationOutput(row, activeNode.config);
                                    return (
                                      <div key={index} className="p-1 bg-[#06191c] rounded border border-teal-900/50 text-[9px] font-mono text-teal-300">
                                        <span className="text-[8px] text-teal-600 block mb-0.5">Row #{index + 1}</span>
                                        <div className="truncate text-teal-200" title={combinedStr}>{combinedStr || <em className="text-teal-700">Empty Output</em>}</div>
                                      </div>
                                    );
                                  });
                                })()}
                              </div>
                            </div>
                          </div>
                        )}

                        {activeNode.type === 'SELECT' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Select & Rename Fields</label>
                            <div className="space-y-1.5 border border-teal-950 bg-[#050e10] rounded p-1.5 max-h-52 overflow-y-auto custom-scrollbar">
                              {(() => {
                                if (upstreamColsForActiveNode.length === 0) return <div className="text-[9px] text-teal-600 italic p-2 text-center">Unverified pipeline connections upstream.</div>;
                                
                                return upstreamColsForActiveNode.map(col => {
                                  const currentSelected = activeNode.config.selectedColumns || upstreamColsForActiveNode;
                                  const isChecked = currentSelected.includes(col);
                                  const currentRenames = activeNode.config.renames || {};

                                  return (
                                    <div key={col} className="flex items-center gap-1.5 bg-[#06191c] p-1.5 rounded">
                                      <input 
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => {
                                          const nextSelect = e.target.checked 
                                            ? [...currentSelected, col]
                                            : currentSelected.filter(c => c !== col);
                                          updateNodeConfig(activeNode.id, 'selectedColumns', nextSelect);
                                        }}
                                        className="rounded border-teal-900 bg-[#050e10] text-orange-500 focus:ring-0 cursor-pointer"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center text-[10px] text-teal-200 font-mono">
                                          <span className="truncate">{col}</span>
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAttemptFieldDelete(activeNode.id, col);
                                            }}
                                            className="text-teal-600 hover:text-red-500 p-0.5 rounded transition-all"
                                            title="Exclude/Delete Field"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                        <input 
                                          type="text"
                                          placeholder="Rename field..."
                                          value={currentRenames[col] || ''}
                                          onChange={(e) => {
                                            const nextRenames = { ...currentRenames, [col]: e.target.value };
                                            updateNodeConfig(activeNode.id, 'renames', nextRenames);
                                          }}
                                          className="w-full bg-[#050e10] border border-teal-950 rounded px-1.5 py-0.5 text-[9px] text-teal-100 mt-1 focus:outline-none focus:border-orange-500 font-mono"
                                        />
                                      </div>
                                    </div>
                                  );
                                });
                              })()}
                            </div>
                          </div>
                        )}

                        {activeNode.type === 'UID' && (
                          <div className="space-y-3.5">
                            <OutputFieldConfig node={activeNode} updateNodeConfig={updateNodeConfig} upstreamCols={upstreamColsForActiveNode} />

                            <div className="space-y-1">
                              <span className="text-[8px] uppercase font-bold text-teal-500">Available Upstream Fields (Click to append):</span>
                              <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto p-1.5 bg-[#050e10] rounded border border-teal-950 custom-scrollbar">
                                {upstreamColsForActiveNode.length > 0 ? upstreamColsForActiveNode.map(c => (
                                  <button 
                                    key={c}
                                    onClick={() => {
                                      const curr = activeNode.config.selectedFields || [];
                                      updateNodeConfig(activeNode.id, 'selectedFields', [...curr, c]);
                                    }}
                                    className="text-[8.5px] bg-[#06191c] hover:bg-orange-950/50 hover:text-orange-400 text-teal-300 border border-teal-900 px-1 rounded font-mono"
                                  >
                                    + {c}
                                  </button>
                                )) : (
                                  <div className="text-[9px] text-teal-600 italic px-1">Connect upstream tool to load fields.</div>
                                )}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[8px] uppercase font-bold text-orange-400">Selected Fields for UID Pattern (In Order):</span>
                              <div className="flex flex-col gap-1 p-1.5 bg-[#050e10] rounded border border-teal-950 max-h-32 overflow-y-auto custom-scrollbar">
                                {(!activeNode.config.selectedFields || activeNode.config.selectedFields.length === 0) ? (
                                  <div className="text-[9px] text-teal-600 italic">No fields selected.</div>
                                ) : activeNode.config.selectedFields.map((f, idx) => (
                                  <div key={idx} className="flex justify-between items-center bg-[#06191c] border border-teal-900 rounded p-1">
                                    <span className="text-[10px] font-mono text-teal-200 truncate w-32">{f}</span>
                                    <div className="flex items-center gap-0.5">
                                      <button 
                                        onClick={() => {
                                          const curr = [...(activeNode.config.selectedFields || [])];
                                          if (idx > 0) {
                                            [curr[idx-1], curr[idx]] = [curr[idx], curr[idx-1]];
                                            updateNodeConfig(activeNode.id, 'selectedFields', curr);
                                          }
                                        }}
                                        className="p-0.5 text-teal-500 hover:text-teal-300"
                                      >
                                        <ArrowUp className="w-3 h-3" />
                                      </button>
                                      <button 
                                        onClick={() => {
                                          const curr = [...(activeNode.config.selectedFields || [])];
                                          if (idx < curr.length - 1) {
                                            [curr[idx+1], curr[idx]] = [curr[idx], curr[idx+1]];
                                            updateNodeConfig(activeNode.id, 'selectedFields', curr);
                                          }
                                        }}
                                        className="p-0.5 text-teal-500 hover:text-teal-300"
                                      >
                                        <ArrowDown className="w-3 h-3" />
                                      </button>
                                      <button 
                                        onClick={() => {
                                          const curr = [...(activeNode.config.selectedFields || [])];
                                          curr.splice(idx, 1);
                                          updateNodeConfig(activeNode.id, 'selectedFields', curr);
                                        }}
                                        className="p-0.5 text-red-500 hover:text-red-300 ml-1"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider text-teal-400 font-bold mb-1">Prefix</label>
                                <input 
                                  type="text"
                                  placeholder="e.g. CUST_"
                                  value={activeNode.config.prefix !== undefined ? activeNode.config.prefix : ''}
                                  onChange={(e) => updateNodeConfig(activeNode.id, 'prefix', e.target.value)}
                                  className="w-full bg-[#050e10] border border-teal-950 rounded px-2.5 py-1 text-xs text-teal-100 focus:outline-none focus:border-orange-500 font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] uppercase tracking-wider text-teal-400 font-bold mb-1">Suffix</label>
                                <input 
                                  type="text"
                                  placeholder="e.g. _2026"
                                  value={activeNode.config.suffix !== undefined ? activeNode.config.suffix : ''}
                                  onChange={(e) => updateNodeConfig(activeNode.id, 'suffix', e.target.value)}
                                  className="w-full bg-[#050e10] border border-teal-950 rounded px-2.5 py-1 text-xs text-teal-100 focus:outline-none focus:border-orange-500 font-mono"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-teal-400 font-bold mb-1">Concatenation Separator</label>
                              <input 
                                type="text"
                                value={activeNode.config.separator !== undefined ? activeNode.config.separator : '_'}
                                onChange={(e) => updateNodeConfig(activeNode.id, 'separator', e.target.value)}
                                className="w-full bg-[#050e10] border border-teal-950 rounded px-2.5 py-1 text-xs text-teal-100 focus:outline-none focus:border-orange-500 font-mono"
                              />
                            </div>
                          </div>
                        )}

                        {activeNode.type === 'TEXTSPLIT' && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold mb-1">Tool Execution Mode</label>
                              <select 
                                className="w-full bg-[#050e10] border border-orange-500/50 text-orange-400 rounded p-1.5 text-xs focus:outline-none focus:border-orange-500 font-bold"
                                value={activeNode.config.mode || 'split'}
                                onChange={(e) => updateNodeConfig(activeNode.id, 'mode', e.target.value)}
                              >
                                <option value="split">Split Delimited Text</option>
                                <option value="increment">Auto-Increment Text (New)</option>
                              </select>
                            </div>

                            {activeNode.config.mode === 'increment' ? (
                              <div className="space-y-3.5 bg-orange-950/10 border border-orange-900/30 p-2 rounded">
                                <div>
                                  <label className="block text-[9px] uppercase tracking-wider text-teal-400 font-bold mb-1">Target Overwrite/New Column</label>
                                  <input 
                                    type="text"
                                    list={`cols-${activeNode.id}`}
                                    placeholder="AutoIncrementField..."
                                    value={activeNode.config.targetColumn || 'AutoIncrementField'}
                                    onChange={(e) => updateNodeConfig(activeNode.id, 'targetColumn', e.target.value)}
                                    className="w-full bg-[#050e10] border border-teal-950 rounded px-2.5 py-1 text-xs text-teal-100 focus:outline-none focus:border-orange-500 font-mono"
                                  />
                                  <datalist id={`cols-${activeNode.id}`}>
                                    {upstreamColsForActiveNode.map(c => <option key={c} value={c} />)}
                                  </datalist>
                                </div>

                                <div>
                                  <label className="block text-[9px] uppercase tracking-wider text-teal-400 font-bold mb-1">Custom Base Text</label>
                                  <input 
                                    type="text"
                                    placeholder="e.g. EMP"
                                    value={activeNode.config.customText !== undefined ? activeNode.config.customText : 'TXT'}
                                    onChange={(e) => updateNodeConfig(activeNode.id, 'customText', e.target.value)}
                                    className="w-full bg-[#050e10] border border-teal-950 rounded px-2.5 py-1 text-xs text-teal-100 focus:outline-none focus:border-orange-500 font-mono"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[9px] uppercase tracking-wider text-teal-400 font-bold mb-1">Zero Padding</label>
                                    <select
                                      value={activeNode.config.padding || 0}
                                      onChange={(e) => updateNodeConfig(activeNode.id, 'padding', Number(e.target.value))}
                                      className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-100 focus:outline-none"
                                    >
                                      <option value={0}>None (e.g. 1)</option>
                                      <option value={2}>2 Zeros (e.g. 01)</option>
                                      <option value={3}>3 Zeros (e.g. 001)</option>
                                      <option value={4}>4 Zeros (e.g. 0001)</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] uppercase tracking-wider text-teal-400 font-bold mb-1">Starting Number</label>
                                    <input 
                                      type="number"
                                      value={activeNode.config.startingIndex !== undefined ? activeNode.config.startingIndex : 1}
                                      onChange={(e) => updateNodeConfig(activeNode.id, 'startingIndex', Number(e.target.value))}
                                      className="w-full bg-[#050e10] border border-teal-950 rounded px-2.5 py-1 text-xs text-teal-100 focus:outline-none focus:border-orange-500 font-mono"
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="block text-[9px] uppercase tracking-wider text-teal-400 font-bold mb-1">Increment Step (+)</label>
                                  <input 
                                    type="number"
                                    value={activeNode.config.step !== undefined ? activeNode.config.step : 1}
                                    onChange={(e) => updateNodeConfig(activeNode.id, 'step', Number(e.target.value))}
                                    className="w-full bg-[#050e10] border border-teal-950 rounded px-2.5 py-1 text-xs text-teal-100 focus:outline-none focus:border-orange-500 font-mono"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3.5 bg-teal-950/10 border border-teal-900/30 p-2 rounded">
                                <div>
                                  <label className="block text-[9px] uppercase tracking-wider text-teal-400 font-bold mb-1">Target Split Column</label>
                                  <select
                                    className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none"
                                    value={activeNode.config.column || ''}
                                    onChange={(e) => updateNodeConfig(activeNode.id, 'column', e.target.value)}
                                  >
                                    <option value="">-- Choose Column --</option>
                                    {upstreamColsForActiveNode.map(col => <option key={col} value={col}>{col}</option>)}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[9px] uppercase tracking-wider text-teal-400 font-bold mb-1">Delimiter Value</label>
                                  <input 
                                    type="text"
                                    placeholder="e.g. - or , or space"
                                    value={activeNode.config.delimiter || '-'}
                                    onChange={(e) => updateNodeConfig(activeNode.id, 'delimiter', e.target.value)}
                                    className="w-full bg-[#050e10] border border-teal-950 rounded px-2.5 py-1 text-xs text-teal-100 focus:outline-none focus:border-orange-500 font-mono"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[9px] uppercase tracking-wider text-teal-400 font-bold mb-1">New Left Column</label>
                                    <input 
                                      type="text"
                                      value={activeNode.config.col1Name || 'SplitPart1'}
                                      onChange={(e) => updateNodeConfig(activeNode.id, 'col1Name', e.target.value)}
                                      className="w-full bg-[#050e10] border border-teal-950 rounded px-2.5 py-1 text-xs text-teal-100 focus:outline-none focus:border-orange-500 font-mono"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] uppercase tracking-wider text-teal-400 font-bold mb-1">New Right Column</label>
                                    <input 
                                      type="text"
                                      value={activeNode.config.col2Name || 'SplitPart2'}
                                      onChange={(e) => updateNodeConfig(activeNode.id, 'col2Name', e.target.value)}
                                      className="w-full bg-[#050e10] border border-teal-950 rounded px-2.5 py-1 text-xs text-teal-100 focus:outline-none focus:border-orange-500 font-mono"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {activeNode.type === 'FILTER' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Filter Steps</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none"
                              value={activeNode.config.column || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'column', e.target.value)}
                            >
                              <option value="">-- Choose Column --</option>
                              {upstreamColsForActiveNode.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>

                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none"
                              value={activeNode.config.operator || '=='}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'operator', e.target.value)}
                            >
                              <option value="==">is equal to (==)</option>
                              <option value="!=">is not equal to (!=)</option>
                              <option value=">">greater than (&gt;)</option>
                              <option value="<">less than (&lt;)</option>
                              <option value="contains">contains</option>
                            </select>

                            <input 
                              type="text"
                              placeholder="Match threshold..."
                              value={activeNode.config.value || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'value', e.target.value)}
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none focus:border-orange-500 font-mono"
                            />
                          </div>
                        )}

                        {activeNode.type === 'SORT' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Sorting Coordinates</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              value={activeNode.config.column || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'column', e.target.value)}
                            >
                              <option value="">-- Choose Sort Field --</option>
                              {upstreamColsForActiveNode.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>

                            <div className="flex gap-2 text-[10px]">
                              <button 
                                onClick={() => updateNodeConfig(activeNode.id, 'direction', 'ASC')}
                                className={`flex-1 py-1.5 rounded border transition-all ${activeNode.config.direction !== 'DESC' ? 'bg-orange-600/25 border-orange-500 text-orange-400' : 'border-teal-950 bg-[#050e10] text-teal-500'}`}
                              >
                                Ascending (A-Z)
                              </button>
                              <button 
                                onClick={() => updateNodeConfig(activeNode.id, 'direction', 'DESC')}
                                className={`flex-1 py-1.5 rounded border transition-all ${activeNode.config.direction === 'DESC' ? 'bg-orange-600/25 border-orange-500 text-orange-400' : 'border-teal-950 bg-[#050e10] text-teal-500'}`}
                              >
                                Descending (Z-A)
                              </button>
                            </div>
                          </div>
                        )}

                        {activeNode.type === 'LOOKUP' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">XLOOKUP Keys</label>
                            {(() => {
                              const incomingEdges = edges.filter(e => e.to === activeNode.id);
                              const baseEdge = incomingEdges.find(e => e.toPort === 'in1' || e.toPort === 'in');
                              const refEdge = incomingEdges.find(e => e.toPort === 'in2');

                              const baseParent = baseEdge ? nodes.find(n => n.id === baseEdge.from) : null;
                              const refParent = refEdge ? nodes.find(n => n.id === refEdge.from) : null;

                              const baseCols = baseParent?.outputData?.columns || [];
                              const refCols = refParent?.outputData?.columns || [];

                              return (
                                <>
                                  <div className="p-2 bg-[#050e10] rounded border border-teal-950 text-[9px] text-teal-400 leading-relaxed font-mono">
                                    <div>Primary: <span className="text-teal-300">{baseParent ? baseParent.id : 'N/A'}</span></div>
                                    <div>Lookup: <span className="text-orange-400">{refParent ? refParent.id : 'N/A'}</span></div>
                                  </div>

                                  <label className="block text-[9px] uppercase text-teal-500 font-bold">Base Match Target</label>
                                  <select
                                    className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                                    value={activeNode.config.baseKey || ''}
                                    onChange={(e) => updateNodeConfig(activeNode.id, 'baseKey', e.target.value)}
                                  >
                                    <option value="">-- Select base key --</option>
                                    {baseCols.map(col => <option key={col} value={col}>{col}</option>)}
                                  </select>

                                  <label className="block text-[9px] uppercase text-teal-500 font-bold">Reference Key</label>
                                  <select
                                    className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                                    value={activeNode.config.lookupKey || ''}
                                    onChange={(e) => updateNodeConfig(activeNode.id, 'lookupKey', e.target.value)}
                                  >
                                    <option value="">-- Select ref key --</option>
                                    {refCols.map(col => <option key={col} value={col}>{col}</option>)}
                                  </select>

                                  <label className="block text-[9px] uppercase text-teal-500 font-bold">Attribute to Extract</label>
                                  <select
                                    className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                                    value={activeNode.config.returnCol || ''}
                                    onChange={(e) => updateNodeConfig(activeNode.id, 'returnCol', e.target.value)}
                                  >
                                    <option value="">-- Select return value --</option>
                                    {refCols.map(col => <option key={col} value={col}>{col}</option>)}
                                  </select>
                                </>
                              );
                            })()}
                          </div>
                        )}

                        {activeNode.type === 'JOIN' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Merge Configuration</label>
                            {(() => {
                              const incomingEdges = edges.filter(e => e.to === activeNode.id);
                              const baseEdge = incomingEdges.find(e => e.toPort === 'in1' || e.toPort === 'in');
                              const refEdge = incomingEdges.find(e => e.toPort === 'in2');

                              const baseParent = baseEdge ? nodes.find(n => n.id === baseEdge.from) : null;
                              const refParent = refEdge ? nodes.find(n => n.id === refEdge.from) : null;

                              const baseCols = baseParent?.outputData?.columns || [];
                              const refCols = refParent?.outputData?.columns || [];

                              return (
                                <>
                                  <label className="block text-[9px] uppercase text-teal-500 font-bold">Join Coordinates</label>
                                  <select
                                    className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none"
                                    value={activeNode.config.joinType || 'inner'}
                                    onChange={(e) => updateNodeConfig(activeNode.id, 'joinType', e.target.value)}
                                  >
                                    <option value="inner">INNER JOIN (Intersection)</option>
                                    <option value="left">LEFT JOIN (Preserve Primary)</option>
                                    <option value="right">RIGHT JOIN (Preserve Secondary)</option>
                                    <option value="outer">FULL OUTER JOIN (Preserve All)</option>
                                  </select>

                                  <label className="block text-[9px] uppercase text-teal-500 font-bold">Left Join Key</label>
                                  <select
                                    className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                                    value={activeNode.config.leftKey || ''}
                                    onChange={(e) => updateNodeConfig(activeNode.id, 'leftKey', e.target.value)}
                                  >
                                    <option value="">-- Select left key --</option>
                                    {baseCols.map(col => <option key={col} value={col}>{col}</option>)}
                                  </select>

                                  <label className="block text-[9px] uppercase text-teal-500 font-bold">Right Join Key</label>
                                  <select
                                    className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                                    value={activeNode.config.rightKey || ''}
                                    onChange={(e) => updateNodeConfig(activeNode.id, 'rightKey', e.target.value)}
                                  >
                                    <option value="">-- Select right key --</option>
                                    {refCols.map(col => <option key={col} value={col}>{col}</option>)}
                                  </select>
                                </>
                              );
                            })()}
                          </div>
                        )}

                        {activeNode.type === 'MATCH_RECONCILIATION' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-amber-400 font-bold">Match & Reconciliation</label>
                            {(() => {
                              const incomingEdges = edges.filter(e => e.to === activeNode.id);
                              const baseEdge = incomingEdges.find(e => e.toPort === 'in1' || e.toPort === 'in');
                              const refEdge = incomingEdges.find(e => e.toPort === 'in2');

                              const baseParent = baseEdge ? nodes.find(n => n.id === baseEdge.from) : null;
                              const refParent = refEdge ? nodes.find(n => n.id === refEdge.from) : null;

                              const baseCols = baseParent?.outputData?.columns || [];
                              const refCols = refParent?.outputData?.columns || [];

                              return (
                                <>
                                  <label className="block text-[9px] uppercase text-teal-500 font-bold">Primary Key (File A)</label>
                                  <select
                                    className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                                    value={activeNode.config.leftKey || ''}
                                    onChange={(e) => updateNodeConfig(activeNode.id, 'leftKey', e.target.value)}
                                  >
                                    <option value="">-- Select Key A --</option>
                                    {baseCols.map(col => <option key={col} value={col}>{col}</option>)}
                                  </select>

                                  <label className="block text-[9px] uppercase text-teal-500 font-bold">Secondary Key (File B)</label>
                                  <select
                                    className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                                    value={activeNode.config.rightKey || ''}
                                    onChange={(e) => updateNodeConfig(activeNode.id, 'rightKey', e.target.value)}
                                  >
                                    <option value="">-- Select Key B --</option>
                                    {refCols.map(col => <option key={col} value={col}>{col}</option>)}
                                  </select>

                                  <label className="block text-[9px] uppercase text-teal-500 font-bold mt-2">Comparison Options</label>
                                  <div className="flex items-center mt-1">
                                    <input 
                                      type="checkbox" 
                                      checked={activeNode.config.caseInsensitive || false}
                                      onChange={(e) => updateNodeConfig(activeNode.id, 'caseInsensitive', e.target.checked)}
                                      className="mr-2"
                                    />
                                    <span className="text-[10px] text-teal-200">Case Insensitive Match</span>
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <input 
                                      type="checkbox" 
                                      checked={activeNode.config.trimText || false}
                                      onChange={(e) => updateNodeConfig(activeNode.id, 'trimText', e.target.checked)}
                                      className="mr-2"
                                    />
                                    <span className="text-[10px] text-teal-200">Trim Leading/Trailing Spaces</span>
                                  </div>

                                  {activeNode.outputData?.dashboard && (
                                    <div className="mt-4 p-2 bg-[#06191c] border border-teal-900 rounded">
                                      <div className="text-[10px] text-amber-400 font-bold uppercase border-b border-teal-900 pb-1 mb-2">Match Summary Dashboard</div>
                                      <div className="grid grid-cols-2 gap-2 text-[10px] text-teal-200 font-mono">
                                        <div>Records A: <span className="text-teal-400">{activeNode.outputData.dashboard.totalA}</span></div>
                                        <div>Records B: <span className="text-teal-400">{activeNode.outputData.dashboard.totalB}</span></div>
                                        <div>Matched: <span className="text-emerald-400 font-bold">{activeNode.outputData.dashboard.matched}</span></div>
                                        <div>Mismatches: <span className="text-orange-400">{activeNode.outputData.dashboard.mismatch}</span></div>
                                        <div>Missing A: <span className="text-rose-400">{activeNode.outputData.dashboard.missingA}</span></div>
                                        <div>Missing B: <span className="text-rose-400">{activeNode.outputData.dashboard.missingB}</span></div>
                                        <div>Duplicates: <span className="text-purple-400">{activeNode.outputData.dashboard.duplicates}</span></div>
                                        <div>Match %: <span className="text-emerald-400">{activeNode.outputData.dashboard.matchPercentage}%</span></div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}

                        {activeNode.type === 'SMART_MATCH' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-amber-400 font-bold">Smart Match Settings</label>
                            {(() => {
                              const incomingEdges = edges.filter(e => e.to === activeNode.id);
                              const baseEdge = incomingEdges.find(e => e.toPort === 'in1' || e.toPort === 'in');
                              const refEdge = incomingEdges.find(e => e.toPort === 'in2');

                              const baseParent = baseEdge ? nodes.find(n => n.id === baseEdge.from) : null;
                              const refParent = refEdge ? nodes.find(n => n.id === refEdge.from) : null;

                              const baseCols = baseParent?.outputData?.columns || [];
                              const refCols = refParent?.outputData?.columns || [];

                              const criteria = activeNode.config.criteria || [];

                              return (
                                <>
                                  <label className="block text-[9px] uppercase text-teal-500 font-bold">Primary Key (File A)</label>
                                  <select
                                    className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                                    value={activeNode.config.leftKey || ''}
                                    onChange={(e) => updateNodeConfig(activeNode.id, 'leftKey', e.target.value)}
                                  >
                                    <option value="">-- Select Key A --</option>
                                    {baseCols.map(col => <option key={col} value={col}>{col}</option>)}
                                  </select>

                                  <label className="block text-[9px] uppercase text-teal-500 font-bold">Primary Key (File B)</label>
                                  <select
                                    className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                                    value={activeNode.config.rightKey || ''}
                                    onChange={(e) => updateNodeConfig(activeNode.id, 'rightKey', e.target.value)}
                                  >
                                    <option value="">-- Select Key B --</option>
                                    {refCols.map(col => <option key={col} value={col}>{col}</option>)}
                                  </select>

                                  {/* CRITERIA BUILDER */}
                                  <div className="border-t border-teal-950/60 pt-2 mt-2 space-y-2">
                                    <label className="block text-[9px] uppercase text-teal-500 font-bold">Add Matching Criteria</label>
                                    
                                    <div className="space-y-1.5 bg-[#050e10]/60 p-2 rounded border border-teal-950/40">
                                      <select
                                        className="w-full bg-[#050e10] border border-teal-950 rounded p-1 text-[11px] text-teal-200 focus:outline-none font-mono"
                                        value={smLeftCol}
                                        onChange={(e) => setSmLeftCol(e.target.value)}
                                      >
                                        <option value="">-- Left Column (A) --</option>
                                        {baseCols.map(col => <option key={col} value={col}>{col}</option>)}
                                      </select>

                                      <select
                                        className="w-full bg-[#050e10] border border-teal-950 rounded p-1 text-[11px] text-teal-200 focus:outline-none font-mono"
                                        value={smRightCol}
                                        onChange={(e) => setSmRightCol(e.target.value)}
                                      >
                                        <option value="">-- Right Column (B) --</option>
                                        {refCols.map(col => <option key={col} value={col}>{col}</option>)}
                                      </select>

                                      <div className="flex gap-2">
                                        <select
                                          className="flex-1 bg-[#050e10] border border-teal-950 rounded p-1 text-[11px] text-teal-200 focus:outline-none font-mono"
                                          value={smMatchType}
                                          onChange={(e) => setSmMatchType(e.target.value)}
                                        >
                                          <option value="exact">Exact</option>
                                          <option value="fuzzy">Fuzzy</option>
                                          <option value="relationship">Relationship</option>
                                        </select>

                                        <input
                                          type="number"
                                          step="0.1"
                                          min="0.1"
                                          max="1.0"
                                          className="w-16 bg-[#050e10] border border-teal-950 rounded p-1 text-[11px] text-teal-200 focus:outline-none font-mono text-center"
                                          value={smWeight}
                                          onChange={(e) => setSmWeight(parseFloat(e.target.value) || 1.0)}
                                          placeholder="Weight"
                                          title="Match Weight (0.1 - 1.0)"
                                        />
                                      </div>

                                      <button
                                        type="button"
                                        disabled={!smLeftCol || !smRightCol}
                                        onClick={() => {
                                          const newCriterion = {
                                            leftCol: smLeftCol,
                                            rightCol: smRightCol,
                                            matchType: smMatchType,
                                            weight: smWeight
                                          };
                                          updateNodeConfig(activeNode.id, 'criteria', [...criteria, newCriterion]);
                                          setSmLeftCol('');
                                          setSmRightCol('');
                                          setSmMatchType('exact');
                                          setSmWeight(1.0);
                                        }}
                                        className="w-full py-1 text-[10px] font-bold uppercase tracking-wider bg-orange-600 hover:bg-orange-500 disabled:bg-teal-950 disabled:text-teal-700 text-white rounded transition-all"
                                      >
                                        Add Criteria Rule
                                      </button>
                                    </div>
                                  </div>

                                  {/* CRITERIA LIST */}
                                  {criteria.length > 0 && (
                                    <div className="space-y-1 mt-2">
                                      <label className="block text-[8px] uppercase text-teal-600 font-bold">Active Match Rules ({criteria.length})</label>
                                      <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar border border-teal-950/40 p-1 rounded bg-[#050e10]/30">
                                        {criteria.map((c, idx) => (
                                          <div key={idx} className="flex justify-between items-center text-[10px] bg-[#06191c] p-1.5 rounded font-mono border border-teal-950/30">
                                            <div className="truncate flex-1 pr-2">
                                              <span className="text-amber-400">{c.leftCol}</span> ↔ <span className="text-teal-400">{c.rightCol}</span>
                                              <span className="text-teal-600 ml-1.5">({c.matchType}, w={c.weight})</span>
                                            </div>
                                            <button
                                              onClick={() => {
                                                const next = criteria.filter((_, i) => i !== idx);
                                                updateNodeConfig(activeNode.id, 'criteria', next);
                                              }}
                                              className="text-red-500 hover:text-red-400 p-0.5"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* DASHBOARD SUMMARY */}
                                  {activeNode.outputData?.dashboard && (
                                    <div className="mt-4 p-2 bg-[#06191c] border border-teal-900 rounded">
                                      <div className="text-[10px] text-amber-400 font-bold uppercase border-b border-teal-900 pb-1 mb-2">Smart Match Report</div>
                                      <div className="grid grid-cols-2 gap-2 text-[10px] text-teal-200 font-mono">
                                        <div>Records A: <span className="text-teal-400">{activeNode.outputData.dashboard.totalA}</span></div>
                                        <div>Records B: <span className="text-teal-400">{activeNode.outputData.dashboard.totalB}</span></div>
                                        <div>Perfect Match: <span className="text-emerald-400 font-bold">{activeNode.outputData.dashboard.perfectMatches}</span></div>
                                        <div>Best Match: <span className="text-teal-400">{activeNode.outputData.dashboard.bestMatches}</span></div>
                                        <div>Possible Match: <span className="text-orange-400">{activeNode.outputData.dashboard.possibleMatches}</span></div>
                                        <div>Unmatched: <span className="text-rose-400">{activeNode.outputData.dashboard.unmatched}</span></div>
                                        <div>Dupe Keys A: <span className="text-purple-400">{activeNode.outputData.dashboard.duplicateKeysA}</span></div>
                                        <div>Dupe Keys B: <span className="text-purple-400">{activeNode.outputData.dashboard.duplicateKeysB}</span></div>
                                        <div className="col-span-2 border-t border-teal-950/60 pt-1 mt-1 text-center font-bold text-emerald-400">
                                          Match Rate: {activeNode.outputData.dashboard.matchPercentage}%
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}

                        {activeNode.type === 'VOLUME_INCREMENT_MAPPING' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Volume & Increment Mapping</label>
                            {(() => {
                              const cols = upstreamColsForActiveNode || [];
                              const rules = activeNode.config.rules || [];
                              const manualCols = activeNode.config.manualCols || [];
                              
                              const availableCols = manualCols.length > 0 ? manualCols : cols;

                              return (
                                <>
                                  <label className="block text-[9px] uppercase text-teal-500 font-bold">Coverage Name Column</label>
                                  <select
                                    className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                                    value={activeNode.config.coverageCol || ''}
                                    onChange={(e) => updateNodeConfig(activeNode.id, 'coverageCol', e.target.value)}
                                  >
                                    <option value="">-- Auto-Detect Column --</option>
                                    {cols.map(col => <option key={col} value={col}>{col}</option>)}
                                  </select>

                                  <div className="p-2 bg-[#050e10]/40 border border-teal-950/40 rounded text-[9px] text-teal-400/80 leading-relaxed font-sans">
                                    <strong>Auto-Detect:</strong> If left unselected, the engine will automatically scan for columns named "coverage", "product", "plan", "benefit", etc.
                                  </div>

                                  {/* Destination Columns */}
                                  <div className="border-t border-teal-950/40 pt-2 mt-2 space-y-2">
                                    <label className="block text-[9px] uppercase text-teal-500 font-bold">Destination Columns</label>
                                    <div className="grid grid-cols-3 gap-2">
                                      <div>
                                        <span className="text-[8px] text-teal-600 block mb-0.5">Volume</span>
                                        <input 
                                          type="text" 
                                          value={activeNode.config.volumeOut || 'Volume'}
                                          onChange={(e) => updateNodeConfig(activeNode.id, 'volumeOut', e.target.value)}
                                          className="w-full bg-[#050e10] border border-teal-950 rounded p-1 text-[10px] text-teal-200 focus:outline-none font-mono"
                                        />
                                      </div>
                                      <div>
                                        <span className="text-[8px] text-teal-600 block mb-0.5">Increment</span>
                                        <input 
                                          type="text" 
                                          value={activeNode.config.incrementOut || 'Increment'}
                                          onChange={(e) => updateNodeConfig(activeNode.id, 'incrementOut', e.target.value)}
                                          className="w-full bg-[#050e10] border border-teal-950 rounded p-1 text-[10px] text-teal-200 focus:outline-none font-mono"
                                        />
                                      </div>
                                      <div>
                                        <span className="text-[8px] text-teal-600 block mb-0.5">Req. Incr.</span>
                                        <input 
                                          type="text" 
                                          value={activeNode.config.reqIncrementOut || 'Requested_Increment'}
                                          onChange={(e) => updateNodeConfig(activeNode.id, 'reqIncrementOut', e.target.value)}
                                          className="w-full bg-[#050e10] border border-teal-950 rounded p-1 text-[10px] text-teal-200 focus:outline-none font-mono"
                                        />
                                      </div>
                                    </div>

                                    <div className="flex items-center">
                                      <input 
                                        type="checkbox" 
                                        id="overwrite_cols"
                                        checked={activeNode.config.overwrite || false}
                                        onChange={(e) => updateNodeConfig(activeNode.id, 'overwrite', e.target.checked)}
                                        className="rounded border-teal-900 bg-[#050e10] text-orange-500 mr-2 focus:ring-0 cursor-pointer"
                                      />
                                      <label htmlFor="overwrite_cols" className="text-[9px] text-teal-200 cursor-pointer">
                                        Overwrite existing columns if names match
                                      </label>
                                    </div>
                                  </div>

                                  {/* Optional Manual Column Selector */}
                                  <div className="border-t border-teal-950/40 pt-2 mt-2 space-y-1">
                                    <label className="block text-[9px] uppercase text-teal-500 font-bold">Restrict Source Columns (Optional)</label>
                                    <div className="bg-[#050e10] border border-teal-950 rounded p-1.5 max-h-24 overflow-y-auto custom-scrollbar space-y-1">
                                      {cols.length === 0 ? (
                                        <div className="text-[8px] text-teal-600 italic">No columns available.</div>
                                      ) : (
                                        cols.map(col => {
                                          const isChecked = manualCols.includes(col);
                                          return (
                                            <label key={col} className="flex items-center gap-1.5 text-[9px] text-teal-200 cursor-pointer hover:text-teal-100">
                                              <input 
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={(e) => {
                                                  const nextList = e.target.checked 
                                                    ? [...manualCols, col]
                                                    : manualCols.filter(c => c !== col);
                                                  updateNodeConfig(activeNode.id, 'manualCols', nextList);
                                                }}
                                                className="rounded border-teal-900 bg-[#050e10] text-teal-600 focus:ring-0 cursor-pointer scale-75"
                                              />
                                              <span className="truncate">{col}</span>
                                            </label>
                                          );
                                        })
                                      )}
                                    </div>
                                  </div>

                                  {/* RULE BUILDER */}
                                  <div className="border-t border-teal-950/40 pt-2 mt-2 space-y-1.5 bg-[#050e10]/60 p-2 rounded border border-teal-950/40">
                                    <label className="block text-[9px] uppercase text-teal-500 font-bold">Add Mapping Rule</label>
                                    
                                    <input 
                                      type="text" 
                                      placeholder="Coverage Name (e.g. Employee Life)"
                                      value={volMappingCoverage}
                                      onChange={(e) => setVolMappingCoverage(e.target.value)}
                                      className="w-full bg-[#050e10] border border-teal-950 rounded p-1 text-[11px] text-teal-200 focus:outline-none font-mono"
                                    />

                                    <div className="space-y-1 pt-1">
                                      <span className="text-[8px] text-teal-600 block">Volume Source</span>
                                      <select
                                        className="w-full bg-[#050e10] border border-teal-950 rounded p-1 text-[11px] text-teal-200 focus:outline-none font-mono"
                                        value={volMappingVolume}
                                        onChange={(e) => setVolMappingVolume(e.target.value)}
                                      >
                                        <option value="">-- Choose Column or Type below --</option>
                                        {availableCols.map(col => <option key={col} value={col}>{col}</option>)}
                                      </select>
                                      {!availableCols.includes(volMappingVolume) && volMappingVolume !== '' && (
                                        <span className="text-[8px] text-orange-500/80 italic block">Treating as custom static value</span>
                                      )}
                                      <input 
                                        type="text"
                                        placeholder="Or enter custom static value / override"
                                        value={availableCols.includes(volMappingVolume) ? '' : volMappingVolume}
                                        onChange={(e) => setVolMappingVolume(e.target.value)}
                                        className="w-full bg-[#050e10] border border-teal-950 rounded p-1 text-[10px] text-teal-200 focus:outline-none font-mono"
                                        disabled={availableCols.includes(volMappingVolume) && volMappingVolume !== ''}
                                      />
                                    </div>

                                    <div className="space-y-1 pt-1">
                                      <span className="text-[8px] text-teal-600 block">Increment Source</span>
                                      <select
                                        className="w-full bg-[#050e10] border border-teal-950 rounded p-1 text-[11px] text-teal-200 focus:outline-none font-mono"
                                        value={volMappingIncrement}
                                        onChange={(e) => setVolMappingIncrement(e.target.value)}
                                      >
                                        <option value="">-- Choose Column or Type below --</option>
                                        {availableCols.map(col => <option key={col} value={col}>{col}</option>)}
                                      </select>
                                      <input 
                                        type="text"
                                        placeholder="Or enter custom static value / override"
                                        value={availableCols.includes(volMappingIncrement) ? '' : volMappingIncrement}
                                        onChange={(e) => setVolMappingIncrement(e.target.value)}
                                        className="w-full bg-[#050e10] border border-teal-950 rounded p-1 text-[10px] text-teal-200 focus:outline-none font-mono"
                                        disabled={availableCols.includes(volMappingIncrement) && volMappingIncrement !== ''}
                                      />
                                    </div>

                                    <div className="space-y-1 pt-1">
                                      <span className="text-[8px] text-teal-600 block">Requested Increment Source</span>
                                      <select
                                        className="w-full bg-[#050e10] border border-teal-950 rounded p-1 text-[11px] text-teal-200 focus:outline-none font-mono"
                                        value={volMappingReqIncrement}
                                        onChange={(e) => setVolMappingReqIncrement(e.target.value)}
                                      >
                                        <option value="">-- Choose Column or Type below --</option>
                                        {availableCols.map(col => <option key={col} value={col}>{col}</option>)}
                                      </select>
                                      <input 
                                        type="text"
                                        placeholder="Or enter custom static value / override"
                                        value={availableCols.includes(volMappingReqIncrement) ? '' : volMappingReqIncrement}
                                        onChange={(e) => setVolMappingReqIncrement(e.target.value)}
                                        className="w-full bg-[#050e10] border border-teal-950 rounded p-1 text-[10px] text-teal-200 focus:outline-none font-mono"
                                        disabled={availableCols.includes(volMappingReqIncrement) && volMappingReqIncrement !== ''}
                                      />
                                    </div>

                                    <button
                                      type="button"
                                      disabled={!volMappingCoverage || (!volMappingVolume && !volMappingIncrement && !volMappingReqIncrement)}
                                      onClick={() => {
                                        const newRule = {
                                          coverageValue: volMappingCoverage,
                                          volumeSource: volMappingVolume,
                                          incrementSource: volMappingIncrement,
                                          reqIncrementSource: volMappingReqIncrement
                                        };
                                        updateNodeConfig(activeNode.id, 'rules', [...rules, newRule]);
                                        setVolMappingCoverage('');
                                        setVolMappingVolume('');
                                        setVolMappingIncrement('');
                                        setVolMappingReqIncrement('');
                                      }}
                                      className="w-full py-1 mt-1.5 text-[10px] font-bold uppercase tracking-wider bg-orange-600 hover:bg-orange-500 disabled:bg-teal-950 disabled:text-teal-700 text-white rounded transition-all"
                                    >
                                      Add Mapping Rule
                                    </button>
                                  </div>

                                  {/* RULES LIST */}
                                  {rules.length > 0 && (
                                    <div className="space-y-1 mt-2">
                                      <label className="block text-[8px] uppercase text-teal-600 font-bold">Active Mapping Rules ({rules.length})</label>
                                      <div className="space-y-1 max-h-36 overflow-y-auto custom-scrollbar border border-teal-950/40 p-1 rounded bg-[#050e10]/30">
                                        {rules.map((r, idx) => (
                                          <div key={idx} className="flex justify-between items-start text-[9px] bg-[#06191c] p-1.5 rounded font-mono border border-teal-950/30">
                                            <div className="truncate flex-1 pr-2 leading-relaxed">
                                              <div className="text-amber-400 font-bold">{r.coverageValue}</div>
                                              {r.volumeSource && <div className="text-teal-300">Volume: {r.volumeSource}</div>}
                                              {r.incrementSource && <div className="text-teal-300">Incr: {r.incrementSource}</div>}
                                              {r.reqIncrementSource && <div className="text-teal-300">Req Incr: {r.reqIncrementSource}</div>}
                                            </div>
                                            <button
                                              onClick={() => {
                                                const next = rules.filter((_, i) => i !== idx);
                                                updateNodeConfig(activeNode.id, 'rules', next);
                                              }}
                                              className="text-red-500 hover:text-red-400 p-0.5"
                                            >
                                              <X className="w-3 h-3" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        )}

                        {activeNode.type === 'BROWSE' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Data Profile & Statistics</label>
                            {!activeNode.outputData?.profiling ? (
                              <div className="text-[9px] text-teal-600 italic">Run pipeline to generate profiling data.</div>
                            ) : (
                              <div className="space-y-2">
                                {Object.entries(activeNode.outputData.profiling).map(([col, stats]) => (
                                  <div key={col} className="bg-[#050e10] border border-teal-950 p-2 rounded text-[9px] font-mono text-teal-300">
                                    <div className="font-bold text-orange-400 mb-1 border-b border-teal-900 pb-1">{col}</div>
                                    <div className="grid grid-cols-2 gap-1">
                                      <div>Type: <span className="text-teal-100">{stats.type}</span></div>
                                      <div>Nulls: <span className="text-teal-100">{stats.nulls}</span></div>
                                      <div>Distinct: <span className="text-teal-100">{stats.distinct}</span></div>
                                      {stats.type === 'number' && (
                                        <>
                                          <div>Min: <span className="text-teal-100">{stats.min}</span></div>
                                          <div>Max: <span className="text-teal-100">{stats.max}</span></div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {activeNode.type === 'SAMPLE' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Sample Configuration</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none"
                              value={activeNode.config.mode || 'first'}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'mode', e.target.value)}
                            >
                              <option value="first">First N Rows</option>
                              <option value="last">Last N Rows</option>
                              <option value="random">Random N Rows</option>
                              <option value="percent">Percentage (%)</option>
                            </select>
                            <input 
                              type="number"
                              min="1"
                              value={activeNode.config.amount !== undefined ? activeNode.config.amount : 10}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'amount', Number(e.target.value))}
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none focus:border-orange-500 font-mono"
                            />
                          </div>
                        )}

                        {activeNode.type === 'COMMENT' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Workflow Notes</label>
                            <textarea 
                              placeholder="Enter notes..."
                              value={activeNode.config.text || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'text', e.target.value)}
                              className="w-full bg-[#050e10] text-teal-100 font-sans text-xs border border-teal-950 rounded p-2 h-32 focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        )}

                        {activeNode.type === 'APPEND' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-amber-400 font-bold">Append (Cartesian Join)</label>
                            <div className="p-2.5 bg-amber-950/20 border border-amber-900/40 rounded text-[9px] text-amber-300 leading-relaxed font-mono">
                              ⚠️ Warning: Append performs a Cartesian Product (No Keys). Every row in the left target will be duplicated for every row in the right target.
                            </div>
                          </div>
                        )}

                        {activeNode.type === 'FIND_REPLACE' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Find Replace</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              value={activeNode.config.targetColumn || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'targetColumn', e.target.value)}
                            >
                              <option value="">-- Target Column --</option>
                              {upstreamColsForActiveNode.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                            <input 
                              type="text"
                              placeholder="Search Value..."
                              value={activeNode.config.searchVal || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'searchVal', e.target.value)}
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                            />
                            <input 
                              type="text"
                              placeholder="Replace Value..."
                              value={activeNode.config.replaceVal || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'replaceVal', e.target.value)}
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                            />
                            <div>
                              <label className="block text-[9px] uppercase tracking-wider text-teal-400 font-bold mb-1">New Column Name (Optional)</label>
                              <input 
                                type="text"
                                placeholder="Overwrite existing if blank"
                                value={activeNode.config.newColumnName || ''}
                                onChange={(e) => updateNodeConfig(activeNode.id, 'newColumnName', e.target.value)}
                                className="w-full bg-[#050e10] border border-teal-950 rounded px-2.5 py-1 text-xs text-teal-100 focus:outline-none focus:border-orange-500 font-mono"
                              />
                            </div>
                          </div>
                        )}

                        {activeNode.type === 'MULTI_ROW' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Multi-Row Formula</label>
                            <OutputFieldConfig node={activeNode} updateNodeConfig={updateNodeConfig} upstreamCols={upstreamColsForActiveNode} />
                            <div className="p-2 bg-[#050e10] rounded border border-teal-950 text-[9px] text-teal-400 font-mono">
                              Use `[row-1:Col]` for previous row.<br/>
                              Use `[Col]` for current row.<br/>
                              Example: `[row-1:Col] + [Col]`
                            </div>
                            <textarea 
                              placeholder="e.g. [row-1:Sales] + [Sales]"
                              value={activeNode.config.customFormula || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'customFormula', e.target.value)}
                              className="w-full bg-[#050e10] text-teal-100 font-mono text-xs border border-teal-950 rounded p-2 h-20 focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        )}

                        {activeNode.type === 'REGEX' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Regex Action</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              value={activeNode.config.column || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'column', e.target.value)}
                            >
                              <option value="">-- Target Column --</option>
                              {upstreamColsForActiveNode.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                            <input 
                              type="text"
                              placeholder="Regex Pattern e.g. ^[A-Z]+"
                              value={activeNode.config.pattern || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'pattern', e.target.value)}
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                            />
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none"
                              value={activeNode.config.mode || 'match'}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'mode', e.target.value)}
                            >
                              <option value="match">Match (Boolean)</option>
                              <option value="extract">Extract (First Group)</option>
                              <option value="replace">Replace</option>
                            </select>
                            {activeNode.config.mode === 'replace' && (
                              <input 
                                type="text"
                                placeholder="Replacement text..."
                                value={activeNode.config.replaceVal || ''}
                                onChange={(e) => updateNodeConfig(activeNode.id, 'replaceVal', e.target.value)}
                                className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              />
                            )}
                            <OutputFieldConfig node={activeNode} updateNodeConfig={updateNodeConfig} upstreamCols={upstreamColsForActiveNode} />
                          </div>
                        )}

                        {activeNode.type === 'TEXT_TO_COLUMNS' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Text To Columns</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              value={activeNode.config.column || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'column', e.target.value)}
                            >
                              <option value="">-- Target Column --</option>
                              {upstreamColsForActiveNode.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none"
                              value={activeNode.config.splitMode || 'delimiter'}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'splitMode', e.target.value)}
                            >
                              <option value="delimiter">Split by Delimiter</option>
                              <option value="fixed">Fixed Width Split</option>
                            </select>
                            {activeNode.config.splitMode === 'delimiter' ? (
                              <input 
                                type="text"
                                placeholder="Delimiter e.g. , or -"
                                value={activeNode.config.delimiter || ','}
                                onChange={(e) => updateNodeConfig(activeNode.id, 'delimiter', e.target.value)}
                                className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              />
                            ) : (
                              <input 
                                type="text"
                                placeholder="Comma separated lengths e.g. 3,5,2"
                                value={activeNode.config.fixedWidths || ''}
                                onChange={(e) => updateNodeConfig(activeNode.id, 'fixedWidths', e.target.value)}
                                className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              />
                            )}
                          </div>
                        )}

                        {activeNode.type === 'TRANSPOSE' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Transpose (Wide to Long)</label>
                            <div>
                              <label className="block text-[9px] uppercase text-teal-500 font-bold mb-1">Key Columns (Check to keep)</label>
                              <div className="space-y-1 bg-[#050e10] border border-teal-950 rounded p-2 max-h-32 overflow-y-auto custom-scrollbar">
                                {upstreamColsForActiveNode.map(col => {
                                  const list = activeNode.config.keyColumns || [];
                                  return (
                                    <label key={col} className="flex items-center gap-2 text-[10px] font-mono text-teal-200 cursor-pointer">
                                      <input 
                                        type="checkbox"
                                        checked={list.includes(col)}
                                        onChange={(e) => {
                                          const nextList = e.target.checked ? [...list, col] : list.filter(c => c !== col);
                                          updateNodeConfig(activeNode.id, 'keyColumns', nextList);
                                        }}
                                        className="rounded border-teal-900 bg-teal-950 text-orange-600 focus:ring-0"
                                      />
                                      <span>{col}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="text-[9px] text-teal-400 italic bg-[#050e10] p-1.5 border border-teal-950 rounded">
                              Unchecked columns will be pivoted into 'Name' and 'Value' rows.
                            </div>
                          </div>
                        )}

                        {activeNode.type === 'CROSSTAB' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Cross Tab (Long to Wide)</label>
                            <div>
                              <label className="block text-[9px] uppercase text-teal-500 font-bold mb-1">Group By Columns (Check)</label>
                              <div className="space-y-1 bg-[#050e10] border border-teal-950 rounded p-2 max-h-24 overflow-y-auto custom-scrollbar">
                                {upstreamColsForActiveNode.map(col => {
                                  const list = activeNode.config.groupColumns || [];
                                  return (
                                    <label key={col} className="flex items-center gap-2 text-[10px] font-mono text-teal-200 cursor-pointer">
                                      <input 
                                        type="checkbox"
                                        checked={list.includes(col)}
                                        onChange={(e) => {
                                          const nextList = e.target.checked ? [...list, col] : list.filter(c => c !== col);
                                          updateNodeConfig(activeNode.id, 'groupColumns', nextList);
                                        }}
                                        className="rounded border-teal-900 bg-teal-950 text-orange-600 focus:ring-0"
                                      />
                                      <span>{col}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                            
                            <label className="block text-[9px] uppercase text-teal-500 font-bold">Column Headers</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              value={activeNode.config.headerColumn || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'headerColumn', e.target.value)}
                            >
                              <option value="">-- Header Column --</option>
                              {upstreamColsForActiveNode.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>

                            <label className="block text-[9px] uppercase text-teal-500 font-bold">Values For New Columns</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              value={activeNode.config.valueColumn || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'valueColumn', e.target.value)}
                            >
                              <option value="">-- Value Column --</option>
                              {upstreamColsForActiveNode.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>

                            <label className="block text-[9px] uppercase text-teal-500 font-bold">Aggregation Method</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none"
                              value={activeNode.config.aggregation || 'sum'}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'aggregation', e.target.value)}
                            >
                              <option value="sum">Sum</option>
                              <option value="count">Count</option>
                              <option value="first">First</option>
                              <option value="last">Last</option>
                              <option value="concat">Concatenate</option>
                            </select>
                          </div>
                        )}

                        {activeNode.type === 'PYTHON' && (
                          <div className="space-y-3">
                            <div className="flex border-b border-teal-950 mb-3 bg-[#050e10] rounded p-0.5">
                              {[
                                { id: 'script', name: 'Script' },
                                { id: 'help', name: 'Help' },
                                { id: 'console', name: 'Console' },
                                { id: 'data', name: 'Data' },
                                { id: 'viz', name: 'Visuals' }
                              ].map((t) => (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => setActiveAnalyticsSubTab(t.id)}
                                  className={`flex-1 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-colors ${
                                    activeAnalyticsSubTab === t.id
                                      ? 'bg-blue-600/30 text-blue-300 border border-blue-800'
                                      : 'text-teal-500 hover:text-teal-300'
                                  }`}
                                >
                                  {t.name}
                                </button>
                              ))}
                            </div>

                            {activeAnalyticsSubTab === 'script' && (
                              <div className="space-y-3">
                                <label className="block text-[10px] uppercase tracking-wider text-blue-400 font-bold">Python Script Editor</label>
                                <div className="text-[9px] text-teal-400 italic bg-[#050e10] p-1.5 border border-teal-950 rounded mb-2">
                                  Access input data via the `df` pandas DataFrame.
                                </div>
                                <textarea 
                                  placeholder="import pandas as pd&#10;import numpy as np&#10;&#10;# df is the incoming DataFrame&#10;df['NewCol'] = df['UnitPrice'] * 1.2&#10;print('Total rows processed: ' + str(len(df)))&#10;plt.plot(df['UnitPrice'])"
                                  value={activeNode.config.script || ''}
                                  onChange={(e) => updateNodeConfig(activeNode.id, 'script', e.target.value)}
                                  className="w-full bg-[#050e10] text-blue-100 font-mono text-xs border border-blue-900/50 rounded p-2 h-48 focus:outline-none focus:border-blue-500"
                                  spellCheck="false"
                                />
                                <div className="text-[8.5px] text-teal-600 font-mono text-center">
                                  Expected Workflow: Input Data → Python Tool → Output Data
                                </div>
                              </div>
                            )}

                            {activeAnalyticsSubTab === 'help' && (
                              <div className="space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1 text-xs text-teal-300 leading-relaxed font-sans">
                                <h4 className="font-bold text-teal-100 text-[11px] border-b border-teal-950 pb-0.5">What the tool does</h4>
                                <p className="text-[10px]">Executes custom Python code on workflow streams to perform advanced data cleaning, calculations, and plotting.</p>
                                
                                <h4 className="font-bold text-teal-100 text-[11px] border-b border-teal-950 pb-0.5">Workflow Integration</h4>
                                <p className="text-[10px]"><strong>Input Data</strong> (Dataset 1) → <strong>Python Tool</strong> → <strong>Output Data</strong>. Connect any table to the left input port of this tool block.</p>
                                
                                <h4 className="font-bold text-teal-100 text-[11px] border-b border-teal-950 pb-0.5">How to access data</h4>
                                <p className="text-[10px]">The incoming dataset is automatically loaded as a pandas DataFrame named <code className="text-orange-400 font-mono">df</code>.</p>
                                
                                <h4 className="font-bold text-teal-100 text-[11px] border-b border-teal-950 pb-0.5">How to return data</h4>
                                <p className="text-[10px]">Modify columns on the <code className="text-orange-400 font-mono">df</code> object or add new columns. The final state of `df` will be sent downstream.</p>
                                
                                <h4 className="font-bold text-teal-100 text-[11px] border-b border-teal-950 pb-0.5">Example Script</h4>
                                <pre className="bg-[#050e10] p-1.5 rounded border border-teal-950 text-[9px] text-blue-200 font-mono overflow-x-auto">
{`# Add column
df['Tax'] = df['UnitPrice'] * 0.1
# Drop column
df.drop(columns=['SupplierCode'])
# Logging/printing
print("Standard log msg")
# Plot visual
plt.plot(df['Tax'])`}
                                </pre>
                              </div>
                            )}

                            {activeAnalyticsSubTab === 'console' && (
                              <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-wider text-teal-500 font-bold">Console Outputs</label>
                                <div className="bg-[#050e10] border border-teal-950 rounded p-2 font-mono text-[9px] text-teal-200 h-48 overflow-y-auto custom-scrollbar">
                                  {activeNode.outputData?.consoleLogs && activeNode.outputData.consoleLogs.length > 0 ? (
                                    activeNode.outputData.consoleLogs.map((log, idx) => {
                                      let colorClass = 'text-teal-400';
                                      if (log.toLowerCase().includes('error')) colorClass = 'text-red-400 font-semibold';
                                      else if (log.toLowerCase().includes('warning')) colorClass = 'text-yellow-400';
                                      return (
                                        <div key={idx} className={`${colorClass} py-0.5 border-b border-teal-950/40 last:border-b-0 whitespace-pre-wrap`}>
                                          {log}
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <div className="text-teal-700 italic">No logs generated. Execute node to populate logs.</div>
                                  )}
                                </div>
                              </div>
                            )}

                            {activeAnalyticsSubTab === 'data' && (
                              <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-wider text-teal-500 font-bold">DataFrame Preview</label>
                                {activeNode.outputData?.data && activeNode.outputData.data.length > 0 ? (
                                  <div className="space-y-2">
                                    <div className="text-[10px] text-orange-400 font-mono">
                                      Records: <span className="font-bold">{activeNode.outputData.data.length}</span> rows, <span className="font-bold">{activeNode.outputData.columns.length}</span> columns.
                                    </div>
                                    <div className="max-h-40 overflow-auto border border-teal-950 rounded custom-scrollbar bg-[#050e10]">
                                      <table className="w-full text-[9px] font-mono text-left border-collapse">
                                        <thead>
                                          <tr className="bg-teal-950/40 text-teal-300 border-b border-teal-950">
                                            {activeNode.outputData.columns.slice(0, 4).map(c => (
                                              <th key={c} className="p-1 truncate max-w-[80px]">{c}</th>
                                            ))}
                                            {activeNode.outputData.columns.length > 4 && <th className="p-1">...</th>}
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-teal-950/40 text-teal-200">
                                          {activeNode.outputData.data.slice(0, 10).map((row, idx) => (
                                            <tr key={idx} className="hover:bg-teal-950/20">
                                              {activeNode.outputData.columns.slice(0, 4).map(c => (
                                                <td key={c} className="p-1 truncate max-w-[80px]">{String(row[c] ?? '')}</td>
                                              ))}
                                              {activeNode.outputData.columns.length > 4 && <td className="p-1">...</td>}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                    {activeNode.outputData.data.length > 10 && (
                                      <div className="text-[8px] text-teal-600 text-center italic">
                                        Showing first 10 rows. See full results in bottom preview panel.
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-teal-700 italic text-[10px]">No output dataset. Execute the node to run scripts.</div>
                                )}
                              </div>
                            )}

                            {activeAnalyticsSubTab === 'viz' && (
                              <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-wider text-teal-500 font-bold">Matplotlib Visualizations</label>
                                {activeNode.outputData?.chartData ? (
                                  <WorkflowChart chartData={activeNode.outputData.chartData} />
                                ) : (
                                  <div className="text-teal-700 italic text-[10px]">No generated visualizations. Call plotting functions like `plt.plot(df['ColName'])` in your script to output charts.</div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {activeNode.type === 'R_TOOL' && (
                          <div className="space-y-3">
                            <div className="flex border-b border-teal-950 mb-3 bg-[#050e10] rounded p-0.5">
                              {[
                                { id: 'script', name: 'Script' },
                                { id: 'help', name: 'Help' },
                                { id: 'console', name: 'Console' },
                                { id: 'data', name: 'Data' },
                                { id: 'viz', name: 'Visuals' }
                              ].map((t) => (
                                <button
                                  key={t.id}
                                  type="button"
                                  onClick={() => setActiveAnalyticsSubTab(t.id)}
                                  className={`flex-1 py-1 text-[9px] font-bold uppercase tracking-wider rounded transition-colors ${
                                    activeAnalyticsSubTab === t.id
                                      ? 'bg-blue-600/30 text-blue-300 border border-blue-800'
                                      : 'text-teal-500 hover:text-teal-300'
                                  }`}
                                >
                                  {t.name}
                                </button>
                              ))}
                            </div>

                            {activeAnalyticsSubTab === 'script' && (
                              <div className="space-y-3">
                                <label className="block text-[10px] uppercase tracking-wider text-blue-400 font-bold">R Script Editor</label>
                                <div className="text-[9px] text-teal-400 italic bg-[#050e10] p-1.5 border border-teal-950 rounded mb-2">
                                  Access input data via the `df` data.frame.
                                </div>
                                <textarea 
                                  placeholder="library(dplyr)&#10;&#10;# df is the incoming data.frame&#10;df$NewCol <- df$UnitPrice * 1.2&#10;print(paste('Processed rows:', nrow(df)))&#10;barplot(df$UnitPrice)"
                                  value={activeNode.config.script || ''}
                                  onChange={(e) => updateNodeConfig(activeNode.id, 'script', e.target.value)}
                                  className="w-full bg-[#050e10] text-blue-100 font-mono text-xs border border-blue-900/50 rounded p-2 h-48 focus:outline-none focus:border-blue-500"
                                  spellCheck="false"
                                />
                                <div className="text-[8.5px] text-teal-600 font-mono text-center">
                                  Expected Workflow: Input Data → R Tool → Output Data
                                </div>
                              </div>
                            )}

                            {activeAnalyticsSubTab === 'help' && (
                              <div className="space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1 text-xs text-teal-300 leading-relaxed font-sans">
                                <h4 className="font-bold text-teal-100 text-[11px] border-b border-teal-950 pb-0.5">What the tool does</h4>
                                <p className="text-[10px]">Executes custom R code on workflow streams to perform data manipulation, filtering, and plotting.</p>
                                
                                <h4 className="font-bold text-teal-100 text-[11px] border-b border-teal-950 pb-0.5">Workflow Integration</h4>
                                <p className="text-[10px]"><strong>Input Data</strong> → <strong>R Tool</strong> → <strong>Output Data</strong>. Connect any upstream table to the left input port of this tool block.</p>
                                
                                <h4 className="font-bold text-teal-100 text-[11px] border-b border-teal-950 pb-0.5">How to access data</h4>
                                <p className="text-[10px]">The incoming dataset is automatically loaded as an R data.frame named <code className="text-orange-400 font-mono">df</code>.</p>
                                
                                <h4 className="font-bold text-teal-100 text-[11px] border-b border-teal-950 pb-0.5">How to return data</h4>
                                <p className="text-[10px]">Modify columns or assign new variables on the <code className="text-orange-400 font-mono">df</code> object. The final value of `df` will be sent downstream.</p>
                                
                                <h4 className="font-bold text-teal-100 text-[11px] border-b border-teal-950 pb-0.5">Example Script</h4>
                                <pre className="bg-[#050e10] p-1.5 rounded border border-teal-950 text-[9px] text-blue-200 font-mono overflow-x-auto">
{`# Add column (R base)
df$Tax <- df$UnitPrice * 0.1
# Add column (dplyr)
df <- df %>% mutate(Tax = UnitPrice * 0.1)
# Logging/printing
print("Standard R print log")
# Barplot visualization
barplot(df$Tax)`}
                                </pre>
                              </div>
                            )}

                            {activeAnalyticsSubTab === 'console' && (
                              <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-wider text-teal-500 font-bold">R Console Outputs</label>
                                <div className="bg-[#050e10] border border-teal-950 rounded p-2 font-mono text-[9px] text-teal-200 h-48 overflow-y-auto custom-scrollbar">
                                  {activeNode.outputData?.consoleLogs && activeNode.outputData.consoleLogs.length > 0 ? (
                                    activeNode.outputData.consoleLogs.map((log, idx) => {
                                      let colorClass = 'text-teal-400';
                                      if (log.toLowerCase().includes('error')) colorClass = 'text-red-400 font-semibold';
                                      else if (log.toLowerCase().includes('warning')) colorClass = 'text-yellow-400';
                                      return (
                                        <div key={idx} className={`${colorClass} py-0.5 border-b border-teal-950/40 last:border-b-0 whitespace-pre-wrap`}>
                                          {log}
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <div className="text-teal-700 italic">No logs generated. Execute node to populate logs.</div>
                                  )}
                                </div>
                              </div>
                            )}

                            {activeAnalyticsSubTab === 'data' && (
                              <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-wider text-teal-500 font-bold">data.frame Preview</label>
                                {activeNode.outputData?.data && activeNode.outputData.data.length > 0 ? (
                                  <div className="space-y-2">
                                    <div className="text-[10px] text-orange-400 font-mono">
                                      Observations: <span className="font-bold">{activeNode.outputData.data.length}</span> rows, <span className="font-bold">{activeNode.outputData.columns.length}</span> variables.
                                    </div>
                                    <div className="max-h-40 overflow-auto border border-teal-950 rounded custom-scrollbar bg-[#050e10]">
                                      <table className="w-full text-[9px] font-mono text-left border-collapse">
                                        <thead>
                                          <tr className="bg-teal-950/40 text-teal-300 border-b border-teal-950">
                                            {activeNode.outputData.columns.slice(0, 4).map(c => (
                                              <th key={c} className="p-1 truncate max-w-[80px]">{c}</th>
                                            ))}
                                            {activeNode.outputData.columns.length > 4 && <th className="p-1">...</th>}
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-teal-950/40 text-teal-200">
                                          {activeNode.outputData.data.slice(0, 10).map((row, idx) => (
                                            <tr key={idx} className="hover:bg-teal-950/20">
                                              {activeNode.outputData.columns.slice(0, 4).map(c => (
                                                <td key={c} className="p-1 truncate max-w-[80px]">{String(row[c] ?? '')}</td>
                                              ))}
                                              {activeNode.outputData.columns.length > 4 && <td className="p-1">...</td>}
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                    {activeNode.outputData.data.length > 10 && (
                                      <div className="text-[8px] text-teal-600 text-center italic">
                                        Showing first 10 observations. See full results in bottom preview panel.
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-teal-700 italic text-[10px]">No output dataset. Execute the node to run scripts.</div>
                                )}
                              </div>
                            )}

                            {activeAnalyticsSubTab === 'viz' && (
                              <div className="space-y-2">
                                <label className="block text-[10px] uppercase tracking-wider text-teal-500 font-bold">R Charts & Visualizations</label>
                                {activeNode.outputData?.chartData ? (
                                  <WorkflowChart chartData={activeNode.outputData.chartData} />
                                ) : (
                                  <div className="text-teal-700 italic text-[10px]">No generated visualizations. Call plotting functions like `plot(df$Col)` or `barplot()` in your script to output R charts.</div>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {activeNode.type === 'LINEAR_REGRESSION' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-purple-400 font-bold">Linear Regression</label>
                            
                            <label className="block text-[9px] uppercase text-teal-500 font-bold mb-1">Dependent Variable (Y)</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              value={activeNode.config.targetColumn || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'targetColumn', e.target.value)}
                            >
                              <option value="">-- Target Column (Y) --</option>
                              {upstreamColsForActiveNode.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>

                            <label className="block text-[9px] uppercase text-teal-500 font-bold mb-1">Independent Variable (X)</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              value={activeNode.config.featureColumn || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'featureColumn', e.target.value)}
                            >
                              <option value="">-- Feature Column (X) --</option>
                              {upstreamColsForActiveNode.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>
                          </div>
                        )}

                        {activeNode.type === 'CLUSTER' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-purple-400 font-bold">Clustering</label>
                            
                            <label className="block text-[9px] uppercase text-teal-500 font-bold mb-1">Algorithm</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              value={activeNode.config.algorithm || 'kmeans'}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'algorithm', e.target.value)}
                            >
                              <option value="kmeans">K-Means Clustering</option>
                              <option value="hierarchical">Hierarchical Clustering</option>
                            </select>

                            <label className="block text-[9px] uppercase text-teal-500 font-bold mb-1">Number of Clusters (K)</label>
                            <input 
                              type="number"
                              min="2"
                              max="100"
                              value={activeNode.config.clusters || 3}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'clusters', parseInt(e.target.value))}
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none focus:border-purple-500 font-mono"
                            />

                            <label className="block text-[9px] uppercase text-teal-500 font-bold mb-1">Feature Columns</label>
                            <div className="space-y-1 bg-[#050e10] border border-teal-950 rounded p-2 max-h-32 overflow-y-auto custom-scrollbar">
                              {upstreamColsForActiveNode.map(col => {
                                const list = activeNode.config.featureColumns || [];
                                return (
                                  <label key={col} className="flex items-center gap-2 text-[10px] font-mono text-teal-200 cursor-pointer">
                                    <input 
                                      type="checkbox"
                                      checked={list.includes(col)}
                                      onChange={(e) => {
                                        const nextList = e.target.checked ? [...list, col] : list.filter(c => c !== col);
                                        updateNodeConfig(activeNode.id, 'featureColumns', nextList);
                                      }}
                                      className="rounded border-teal-900 bg-teal-950 text-purple-600 focus:ring-0"
                                    />
                                    <span>{col}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {activeNode.type === 'DECISION_TREE' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-purple-400 font-bold">Decision Tree</label>
                            
                            <label className="block text-[9px] uppercase text-teal-500 font-bold mb-1">Target Variable</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              value={activeNode.config.targetColumn || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'targetColumn', e.target.value)}
                            >
                              <option value="">-- Target Column --</option>
                              {upstreamColsForActiveNode.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>

                            <label className="block text-[9px] uppercase text-teal-500 font-bold mb-1">Max Tree Depth</label>
                            <input 
                              type="number"
                              min="1"
                              max="20"
                              value={activeNode.config.maxDepth || 5}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'maxDepth', parseInt(e.target.value))}
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none focus:border-purple-500 font-mono"
                            />
                            
                            <label className="block text-[9px] uppercase text-teal-500 font-bold mb-1">Model Type</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              value={activeNode.config.modelType || 'classification'}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'modelType', e.target.value)}
                            >
                              <option value="classification">Classification</option>
                              <option value="regression">Regression</option>
                            </select>
                          </div>
                        )}

                        {activeNode.type === 'NEURAL_NETWORK' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-purple-400 font-bold">Neural Network</label>
                            
                            <label className="block text-[9px] uppercase text-teal-500 font-bold mb-1">Target Variable</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              value={activeNode.config.targetColumn || ''}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'targetColumn', e.target.value)}
                            >
                              <option value="">-- Target Column --</option>
                              {upstreamColsForActiveNode.map(col => <option key={col} value={col}>{col}</option>)}
                            </select>

                            <label className="block text-[9px] uppercase text-teal-500 font-bold mb-1">Hidden Layers</label>
                            <input 
                              type="text"
                              placeholder="e.g. 100,50,25"
                              value={activeNode.config.hiddenLayers || '100,50'}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'hiddenLayers', e.target.value)}
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none focus:border-purple-500 font-mono"
                            />

                            <label className="block text-[9px] uppercase text-teal-500 font-bold mb-1">Activation Function</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              value={activeNode.config.activation || 'relu'}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'activation', e.target.value)}
                            >
                              <option value="relu">ReLU</option>
                              <option value="tanh">Tanh</option>
                              <option value="sigmoid">Sigmoid</option>
                            </select>
                          </div>
                        )}

                        {activeNode.type === 'UNIQUE_CONSTRAINT' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-red-400 font-bold flex items-center gap-1.5"><AlertOctagon className="w-3.5 h-3.5" /> Unique Constraint Validation</label>
                            
                            <label className="block text-[9px] uppercase text-teal-500 font-bold mb-1">Target Columns (Constraint Key)</label>
                            <div className="space-y-1 bg-[#050e10] border border-teal-950 rounded p-2 max-h-32 overflow-y-auto custom-scrollbar">
                              {upstreamColsForActiveNode.map(col => {
                                const list = activeNode.config.keyColumns || [];
                                return (
                                  <label key={col} className="flex items-center gap-2 text-[10px] font-mono text-teal-200 cursor-pointer">
                                    <input 
                                      type="checkbox"
                                      checked={list.includes(col)}
                                      onChange={(e) => {
                                        const nextList = e.target.checked ? [...list, col] : list.filter(c => c !== col);
                                        updateNodeConfig(activeNode.id, 'keyColumns', nextList);
                                      }}
                                      className="rounded border-red-900 bg-red-950/50 text-red-600 focus:ring-0"
                                    />
                                    <span>{col}</span>
                                  </label>
                                );
                              })}
                            </div>
                            
                            <div className="p-2.5 bg-red-950/20 border border-red-900/50 rounded mt-2 text-[9px] text-red-300">
                              <span className="font-bold uppercase tracking-wider mb-1 block">Behavior:</span>
                              If any duplicate records are found based on the selected keys, the execution engine will immediately halt and throw an error to protect data integrity.
                            </div>
                          </div>
                        )}

                        {activeNode.type === 'DUPLICATE_DETECTION' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-pink-400 font-bold">Duplicate Detection</label>
                            
                            <label className="block text-[9px] uppercase text-teal-500 font-bold mb-1">Target Columns (Key)</label>
                            <div className="space-y-1 bg-[#050e10] border border-teal-950 rounded p-2 max-h-32 overflow-y-auto custom-scrollbar">
                              {upstreamColsForActiveNode.map(col => {
                                const list = activeNode.config.keyColumns || [];
                                return (
                                  <label key={col} className="flex items-center gap-2 text-[10px] font-mono text-teal-200 cursor-pointer">
                                    <input 
                                      type="checkbox"
                                      checked={list.includes(col)}
                                      onChange={(e) => {
                                        const nextList = e.target.checked ? [...list, col] : list.filter(c => c !== col);
                                        updateNodeConfig(activeNode.id, 'keyColumns', nextList);
                                      }}
                                      className="rounded border-teal-900 bg-teal-950 text-pink-600 focus:ring-0"
                                    />
                                    <span>{col}</span>
                                  </label>
                                );
                              })}
                            </div>

                            <label className="block text-[9px] uppercase text-teal-500 font-bold mb-1">Action</label>
                            <select
                              className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-xs text-teal-200 focus:outline-none font-mono"
                              value={activeNode.config.action || 'remove'}
                              onChange={(e) => updateNodeConfig(activeNode.id, 'action', e.target.value)}
                            >
                              <option value="remove">Remove Duplicates (Keep First)</option>
                              <option value="keep_only">Isolate Duplicates Only</option>
                              <option value="flag">Flag Duplicates in New Column</option>
                            </select>
                          </div>
                        )}

                        {activeNode.type === 'ADVANCED_NULL_ANALYSIS' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-pink-400 font-bold">Advanced Null Analysis</label>
                            <div className="p-2.5 bg-pink-950/20 rounded border border-pink-900/40 text-[10px] text-teal-300 leading-relaxed font-mono mb-2">
                              This tool completely replaces the incoming dataset with a comprehensive Null Analysis Quality Report.
                            </div>
                          </div>
                        )}

                        {activeNode.type === 'AUTO_FIELD' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-orange-400 font-bold">Auto Field</label>
                            <div className="p-2.5 bg-orange-950/20 rounded border border-orange-900/40 text-[10px] text-teal-300 leading-relaxed font-mono">
                              Automatically detects and converts data types for all columns. Numeric strings become numbers. No configuration needed.
                            </div>
                          </div>
                        )}

                        {activeNode.type === 'SSN_FORMAT' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-cyan-400 font-bold">SSN Format</label>
                            <select value={activeNode.config.inputColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'inputColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none">
                              <option value="">Select Input Column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Format Mask (default: 000-00-0000)</label>
                            <input type="text" placeholder="000-00-0000" value={activeNode.config.formatMask || '000-00-0000'} onChange={e => updateNodeConfig(activeNode.id, 'formatMask', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none" />
                            <OutputFieldConfig node={activeNode} updateNodeConfig={updateNodeConfig} upstreamCols={upstreamColsForActiveNode} />
                          </div>
                        )}

                        {activeNode.type === 'REMOVE_DUPLICATES' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-pink-400 font-bold">Remove Duplicates</label>
                            <label className="block text-[9px] text-teal-400">Key Columns (Duplicates based on)</label>
                            <div className="max-h-32 overflow-y-auto space-y-1 bg-[#050e10] p-1.5 rounded border border-teal-950">
                              {upstreamColsForActiveNode.map(col => {
                                const list = activeNode.config.keyColumns || [];
                                return (
                                  <label key={col} className="flex items-center gap-2 text-[10px] text-teal-200 cursor-pointer">
                                    <input type="checkbox" checked={list.includes(col)} onChange={e => {
                                      const nextList = e.target.checked ? [...list, col] : list.filter(c => c !== col);
                                      updateNodeConfig(activeNode.id, 'keyColumns', nextList);
                                    }} className="accent-pink-600" />
                                    {col}
                                  </label>
                                );
                              })}
                            </div>
                            <select value={activeNode.config.keepOption || 'first'} onChange={e => updateNodeConfig(activeNode.id, 'keepOption', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none">
                              <option value="first">Keep First Occurrence</option>
                              <option value="last">Keep Last Occurrence</option>
                            </select>
                          </div>
                        )}

                        {activeNode.type === 'ARRANGE_COLUMNS' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-orange-400 font-bold">Arrange Columns</label>
                            <div className="text-[10px] text-teal-300 font-mono">
                              Select columns in the exact order you want them output:
                            </div>
                            <div className="max-h-32 overflow-y-auto space-y-1 bg-[#050e10] p-1.5 rounded border border-teal-950">
                              {upstreamColsForActiveNode.map(col => {
                                const list = activeNode.config.selectedColumns || [];
                                const index = list.indexOf(col);
                                return (
                                  <label key={col} className="flex items-center gap-2 text-[10px] text-teal-200 cursor-pointer justify-between pr-2 hover:bg-teal-950/40">
                                    <div className="flex items-center gap-2">
                                      <input type="checkbox" checked={index >= 0} onChange={e => {
                                        const nextList = e.target.checked ? [...list, col] : list.filter(c => c !== col);
                                        updateNodeConfig(activeNode.id, 'selectedColumns', nextList);
                                      }} className="accent-orange-600" />
                                      {col}
                                    </div>
                                    {index >= 0 && <span className="text-[9px] text-orange-400 bg-orange-950/50 px-1 rounded">{index + 1}</span>}
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {activeNode.type === 'COPY_COLUMNS' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-orange-400 font-bold">Copy Columns</label>
                            <label className="block text-[9px] text-teal-400">Select columns to duplicate</label>
                            <div className="max-h-32 overflow-y-auto space-y-1 bg-[#050e10] p-1.5 rounded border border-teal-950">
                              {upstreamColsForActiveNode.map(col => {
                                const list = activeNode.config.selectedColumns || [];
                                return (
                                  <label key={col} className="flex items-center gap-2 text-[10px] text-teal-200 cursor-pointer">
                                    <input type="checkbox" checked={list.includes(col)} onChange={e => {
                                      const nextList = e.target.checked ? [...list, col] : list.filter(c => c !== col);
                                      updateNodeConfig(activeNode.id, 'selectedColumns', nextList);
                                    }} className="accent-orange-600" />
                                    {col}
                                  </label>
                                );
                              })}
                            </div>
                            <label className="block text-[9px] text-teal-400">Suffix for copied columns</label>
                            <input type="text" placeholder="_Copy" value={activeNode.config.suffix || '_Copy'} onChange={e => updateNodeConfig(activeNode.id, 'suffix', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none" />
                          </div>
                        )}

                        {activeNode.type === 'TEXT_INPUT' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Bulk Text Input</label>
                            <div className="p-2 bg-teal-950/20 border border-teal-900/40 rounded text-[9px] text-teal-300">
                              Paste Tab-delimited or Comma-separated data directly here.
                            </div>
                            <textarea 
                              placeholder="Col1&#9;Col2&#10;Val1&#9;Val2"
                              value={activeNode.config.rawText || ''}
                              onChange={e => updateNodeConfig(activeNode.id, 'rawText', e.target.value)}
                              className="w-full h-32 bg-[#050e10] border border-teal-950 rounded p-1.5 text-[10px] text-teal-200 font-mono focus:outline-none whitespace-pre"
                            />
                            <label className="flex items-center gap-2 text-[10px] text-teal-200">
                              <input type="checkbox" checked={activeNode.config.hasHeaders !== false} onChange={e => updateNodeConfig(activeNode.id, 'hasHeaders', e.target.checked)} className="accent-teal-500" />
                              First row contains headers
                            </label>
                          </div>
                        )}

                        {activeNode.type === 'FIELD_INFO' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-orange-400 font-bold">Field Info</label>
                            <div className="p-2.5 bg-orange-950/20 rounded border border-orange-900/40 text-[10px] text-teal-300 leading-relaxed font-mono">
                              Outputs metadata about every field: name, position, size, and detected data type. Replaces the data stream with a field catalog.
                            </div>
                          </div>
                        )}

                        {activeNode.type === 'FUZZY_MATCH' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-amber-400 font-bold">Fuzzy Match</label>
                            <label className="block text-[9px] text-teal-400">Left Key Column</label>
                            <select value={activeNode.config.leftKey || ''} onChange={e => updateNodeConfig(activeNode.id, 'leftKey', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Right Key Column</label>
                            <input type="text" placeholder="Column name in right stream" value={activeNode.config.rightKey || ''} onChange={e => updateNodeConfig(activeNode.id, 'rightKey', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700" />
                            <label className="block text-[9px] text-teal-400">Match Threshold (0.0 - 1.0)</label>
                            <input type="number" step="0.05" min="0" max="1" value={activeNode.config.threshold || 0.7} onChange={e => updateNodeConfig(activeNode.id, 'threshold', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700" />
                          </div>
                        )}

                        {activeNode.type === 'JOIN_MULTIPLE' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-amber-400 font-bold">Join Multiple Keys</label>
                            <div className="p-2.5 bg-amber-950/20 rounded border border-amber-900/40 text-[10px] text-teal-300 leading-relaxed font-mono">
                              Joins two datasets on multiple composite keys. Configure key pairs below.
                            </div>
                            <label className="block text-[9px] text-teal-400">Left Key</label>
                            <select value={activeNode.config.leftKey || ''} onChange={e => updateNodeConfig(activeNode.id, 'leftKey', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select left key...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Right Key</label>
                            <input type="text" placeholder="Right key column" value={activeNode.config.rightKey || ''} onChange={e => updateNodeConfig(activeNode.id, 'rightKey', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700" />
                            <label className="block text-[9px] text-teal-400">Second Left Key (optional)</label>
                            <select value={activeNode.config.leftKey2 || ''} onChange={e => updateNodeConfig(activeNode.id, 'leftKey2', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">None</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Second Right Key (optional)</label>
                            <input type="text" placeholder="Right key 2" value={activeNode.config.rightKey2 || ''} onChange={e => updateNodeConfig(activeNode.id, 'rightKey2', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700" />
                          </div>
                        )}

                        {activeNode.type === 'XML_PARSE' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-cyan-400 font-bold">XML Parse</label>
                            <label className="block text-[9px] text-teal-400">Source Column (containing XML)</label>
                            <select value={activeNode.config.sourceColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'sourceColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        )}

                        {activeNode.type === 'JSON_PARSE' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-cyan-400 font-bold">JSON Parse</label>
                            <label className="block text-[9px] text-teal-400">Source Column (containing JSON)</label>
                            <select value={activeNode.config.sourceColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'sourceColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        )}

                        {activeNode.type === 'DYNAMIC_RENAME' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-cyan-400 font-bold">Dynamic Rename</label>
                            <label className="block text-[9px] text-teal-400">Rename Mode</label>
                            <select value={activeNode.config.renameMode || 'prefix'} onChange={e => updateNodeConfig(activeNode.id, 'renameMode', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="prefix">Add Prefix</option>
                              <option value="suffix">Add Suffix</option>
                              <option value="map">Manual Map</option>
                            </select>
                            {activeNode.config.renameMode !== 'map' && (
                              <>
                                <label className="block text-[9px] text-teal-400">{activeNode.config.renameMode === 'suffix' ? 'Suffix' : 'Prefix'}</label>
                                <input type="text" value={activeNode.config.renameMode === 'suffix' ? (activeNode.config.suffix || '') : (activeNode.config.prefix || '')} onChange={e => updateNodeConfig(activeNode.id, activeNode.config.renameMode === 'suffix' ? 'suffix' : 'prefix', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700" />
                              </>
                            )}
                          </div>
                        )}

                        {activeNode.type === 'RUNNING_TOTAL' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Running Total</label>
                            <label className="block text-[9px] text-teal-400">Value Column</label>
                            <select value={activeNode.config.valueColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'valueColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Group By (optional)</label>
                            <select value={activeNode.config.groupColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'groupColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">No grouping</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Output Column Name</label>
                            <input type="text" value={activeNode.config.outputColumn || 'RunningTotal'} onChange={e => updateNodeConfig(activeNode.id, 'outputColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700" />
                          </div>
                        )}

                        {activeNode.type === 'TILE' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Tile</label>
                            <label className="block text-[9px] text-teal-400">Column to Tile</label>
                            <select value={activeNode.config.column || ''} onChange={e => updateNodeConfig(activeNode.id, 'column', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Number of Tiles</label>
                            <select value={activeNode.config.numTiles || 4} onChange={e => updateNodeConfig(activeNode.id, 'numTiles', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="4">Quartiles (4)</option>
                              <option value="5">Quintiles (5)</option>
                              <option value="10">Deciles (10)</option>
                              <option value="100">Percentiles (100)</option>
                            </select>
                            <label className="block text-[9px] text-teal-400">Output Column Name</label>
                            <input type="text" value={activeNode.config.outputColumn || 'Tile'} onChange={e => updateNodeConfig(activeNode.id, 'outputColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700" />
                          </div>
                        )}

                        {activeNode.type === 'CHARTING' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Chart Tool</label>
                            <label className="block text-[9px] text-teal-400">Chart Type</label>
                            <select value={activeNode.config.chartType || 'bar'} onChange={e => updateNodeConfig(activeNode.id, 'chartType', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="bar">Bar Chart</option>
                              <option value="line">Line Chart</option>
                              <option value="pie">Pie Chart</option>
                              <option value="scatter">Scatter Plot</option>
                            </select>
                            <label className="block text-[9px] text-teal-400">Label Column (X-axis)</label>
                            <select value={activeNode.config.labelColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'labelColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Value Column (Y-axis)</label>
                            <select value={activeNode.config.valueColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'valueColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        )}

                        {activeNode.type === 'REPORT_TEXT' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Report Text</label>
                            <label className="block text-[9px] text-teal-400">Template (use &#123;&#123;ColumnName&#125;&#125;)</label>
                            <textarea value={activeNode.config.template || ''} onChange={e => updateNodeConfig(activeNode.id, 'template', e.target.value)} rows={4} placeholder="e.g. Customer {{Name}} ordered {{Product}} for ${{Amount}}" className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700 font-mono resize-none" />
                          </div>
                        )}

                        {activeNode.type === 'SPATIAL_POINT' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-sky-400 font-bold">Create Spatial Points</label>
                            <label className="block text-[9px] text-teal-400">Latitude Column</label>
                            <select value={activeNode.config.latColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'latColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Longitude Column</label>
                            <select value={activeNode.config.lonColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'lonColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        )}

                        {activeNode.type === 'DISTANCE_CALC' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-sky-400 font-bold">Distance Calculator</label>
                            <label className="block text-[9px] text-teal-400">Latitude 1</label>
                            <select value={activeNode.config.lat1Column || ''} onChange={e => updateNodeConfig(activeNode.id, 'lat1Column', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Longitude 1</label>
                            <select value={activeNode.config.lon1Column || ''} onChange={e => updateNodeConfig(activeNode.id, 'lon1Column', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Latitude 2</label>
                            <select value={activeNode.config.lat2Column || ''} onChange={e => updateNodeConfig(activeNode.id, 'lat2Column', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Longitude 2</label>
                            <select value={activeNode.config.lon2Column || ''} onChange={e => updateNodeConfig(activeNode.id, 'lon2Column', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        )}

                        {activeNode.type === 'SPATIAL_MATCH' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-sky-400 font-bold">Spatial Match</label>
                            <label className="block text-[9px] text-teal-400">Left Latitude</label>
                            <select value={activeNode.config.leftLatColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'leftLatColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Left Longitude</label>
                            <select value={activeNode.config.leftLonColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'leftLonColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Right Lat Column</label>
                            <input type="text" value={activeNode.config.rightLatColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'rightLatColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700" />
                            <label className="block text-[9px] text-teal-400">Right Lon Column</label>
                            <input type="text" value={activeNode.config.rightLonColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'rightLonColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700" />
                            <label className="block text-[9px] text-teal-400">Max Distance (km)</label>
                            <input type="number" value={activeNode.config.maxDistance || 10} onChange={e => updateNodeConfig(activeNode.id, 'maxDistance', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700" />
                          </div>
                        )}

                        {activeNode.type === 'BUFFER' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-sky-400 font-bold">Buffer Creation</label>
                            <label className="block text-[9px] text-teal-400">Latitude Column</label>
                            <select value={activeNode.config.latColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'latColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Longitude Column</label>
                            <select value={activeNode.config.lonColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'lonColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Buffer Radius (km)</label>
                            <input type="number" step="0.1" value={activeNode.config.radius || 1} onChange={e => updateNodeConfig(activeNode.id, 'radius', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700" />
                          </div>
                        )}

                        {activeNode.type === 'AREA_CALC' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-sky-400 font-bold">Area Calculation</label>
                            <label className="block text-[9px] text-teal-400">WKT Polygon Column</label>
                            <select value={activeNode.config.wktColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'wktColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                        )}

                        {activeNode.type === 'LOGISTIC_REGRESSION' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-purple-400 font-bold">Logistic Regression</label>
                            <label className="block text-[9px] text-teal-400">Target Variable (Binary)</label>
                            <select value={activeNode.config.targetColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'targetColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <div className="p-2 bg-purple-950/20 rounded border border-purple-900/40 text-[9px] text-purple-300 font-mono">
                              Appends prediction + probability columns using sigmoid-based classification.
                            </div>
                          </div>
                        )}

                        {activeNode.type === 'RANDOM_FOREST' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-purple-400 font-bold">Random Forest</label>
                            <label className="block text-[9px] text-teal-400">Target Variable</label>
                            <select value={activeNode.config.targetColumn || ''} onChange={e => updateNodeConfig(activeNode.id, 'targetColumn', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700">
                              <option value="">Select column...</option>
                              {upstreamColsForActiveNode.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <label className="block text-[9px] text-teal-400">Number of Trees</label>
                            <input type="number" value={activeNode.config.numTrees || 100} onChange={e => updateNodeConfig(activeNode.id, 'numTrees', e.target.value)} className="w-full bg-[#050e10] border border-teal-950 rounded p-1.5 text-[11px] text-teal-200 focus:outline-none focus:border-teal-700" />
                            <div className="p-2 bg-purple-950/20 rounded border border-purple-900/40 text-[9px] text-purple-300 font-mono">
                              Ensemble tree-based predictions with confidence scores.
                            </div>
                          </div>
                        )}

                        {activeNode.type === 'OUTPUT' && (
                          <div className="space-y-3">
                            <label className="block text-[10px] uppercase tracking-wider text-teal-400 font-bold">Export Generation</label>
                            <div className="p-2.5 bg-emerald-950/20 rounded border border-emerald-900/40 text-[10px] text-teal-300 leading-relaxed font-mono">
                              Compile pipeline to write records out of our virtual runtime heap to a flat physical CSV block.
                            </div>
                            <button 
                              onClick={handleExportData}
                              className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded transition-all shadow"
                            >
                              Compile & Download Spreadsheet
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'logs' && (
                  <div className="space-y-3">
                    <div className="pb-1.5 border-b border-teal-950 flex justify-between items-center">
                      <div>
                        <h4 className="text-[9px] font-bold text-teal-500 uppercase tracking-widest">Real-time Compiler Console</h4>
                      </div>
                      <button 
                        onClick={() => setSystemLogs(["Console runtime cleared."])}
                        className="px-2 py-0.5 text-teal-400 hover:text-white text-[9px] uppercase tracking-wider font-mono bg-[#050e10] border border-teal-950 rounded"
                      >
                        Clear
                      </button>
                    </div>

                    <div className="bg-[#050e10] rounded p-2.5 border border-teal-950 font-mono text-[9.5px] text-teal-300 space-y-2.5 h-[340px] overflow-y-auto custom-scrollbar">
                      {systemLogs.map((log, index) => {
                        let logColor = "text-teal-400";
                        if (log.includes("OK") || log.includes("Success") || log.includes("Injected") || log.includes("completed") || log.includes("Restored")) {
                          logColor = "text-teal-300 font-semibold";
                        } else if (log.includes("Fail") || log.includes("error") || log.includes("abort") || log.includes("Failure") || log.includes("Deleted")) {
                          logColor = "text-red-400 font-semibold";
                        } else if (log.includes("Auto-Compile") || log.includes("Reading") || log.includes("Auto-Sync") || log.includes("Warning") || log.includes("File System") || log.includes("Local Save")) {
                          logColor = "text-orange-400";
                        }
                        return (
                          <div key={index} className={`leading-relaxed border-b border-teal-950/40 pb-1 ${logColor}`}>
                            <span className="text-orange-500 font-bold select-none mr-1">⚡</span>
                            {log}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            </>
          )}
        </aside>
      </div>

      {/* DYNAMIC DEPENDENCY SAFETY DIALOG / MODAL */}
      {deletionWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 transition-all">
          <div className="w-full max-w-md bg-[#06191c] border-2 border-red-500/80 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-8 h-8 shrink-0 animate-bounce" />
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide">Downstream Dependency Alert</h3>
                <p className="text-[10px] text-teal-500 font-mono">Field mapping in active use</p>
              </div>
            </div>

            <div className="p-3 bg-[#050e10] border border-teal-950 rounded-lg text-xs leading-relaxed text-[#cfdadc]">
              The attribute <span className="font-mono text-orange-400 font-bold">"{deletionWarning.fieldName}"</span> is referenced directly by the following downstream workflow coordinates:
              <div className="mt-2 space-y-1 max-h-24 overflow-y-auto custom-scrollbar font-mono text-[10px] text-teal-400">
                {deletionWarning.dependents.map((dep, dIdx) => (
                  <div key={dIdx} className="bg-teal-950/30 px-2 py-0.5 rounded flex items-center justify-between">
                    <span>Block: {dep.name}</span>
                    <span className="text-[8px] text-teal-600">ID: {dep.nodeId}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2.5 text-[9.5px] text-red-400/90 font-semibold">
                Deleting this column will break calculations inside downstream blocks. Exclude anyway?
              </p>
            </div>

            <div className="flex gap-2 text-xs font-bold font-mono">
              <button
                onClick={() => setDeletionWarning(null)}
                className="flex-1 py-2 bg-teal-900/50 hover:bg-teal-900 border border-teal-700/60 rounded text-teal-100 uppercase"
              >
                Keep Field (Cancel)
              </button>
              <button
                onClick={() => executeFieldDeletion(deletionWarning.nodeId, deletionWarning.fieldName)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded text-white uppercase"
              >
                Force Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
