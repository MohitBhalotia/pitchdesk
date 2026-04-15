"use client";

import React, { useState, useMemo } from "react";
import {
  // Business & Finance
  TrendingUp, TrendingDown, DollarSign, PiggyBank, Wallet, CreditCard, BarChart2, BarChart3, LineChart, PieChart,
  // People & Team
  Users, User, UserCheck, UserPlus, Handshake, Award, Star, Trophy, Medal,
  // Tech & Product
  Cpu, Code, Globe, Wifi, Shield, Lock, Database, Server, Cloud, Smartphone, Monitor, Laptop,
  // Arrows & Direction
  ArrowUp, ArrowDown, ArrowRight, ArrowLeft, ArrowUpRight, ArrowRightLeft, RefreshCw, RotateCcw, ChevronUp,
  // Shapes & Symbols
  CheckCircle, XCircle, AlertCircle, Info, HelpCircle, Circle, Square, Triangle, Hexagon, Zap,
  // Actions
  Target, Rocket, Lightbulb, Magnet, Flame, Heart, ThumbsUp, MessageCircle, Mail, Phone, Search,
  // Charts & Data
  Activity, TrendingUpIcon, LayoutGrid, List, Table, Filter, SortAsc, Calendar, Clock,
  // Industry
  Building, Building2, Factory, Store, ShoppingCart, Package, Truck, Plane, Map, MapPin,
  // Nature & Environment
  Leaf, Sun, Moon, Wind, Droplets, TreePine, Mountain, Waves,
} from "lucide-react";

export const ICON_CATALOG = [
  // Business & Finance
  { name: "TrendingUp", Icon: TrendingUp, category: "finance" },
  { name: "TrendingDown", Icon: TrendingDown, category: "finance" },
  { name: "DollarSign", Icon: DollarSign, category: "finance" },
  { name: "PiggyBank", Icon: PiggyBank, category: "finance" },
  { name: "Wallet", Icon: Wallet, category: "finance" },
  { name: "CreditCard", Icon: CreditCard, category: "finance" },
  { name: "BarChart2", Icon: BarChart2, category: "finance" },
  { name: "BarChart3", Icon: BarChart3, category: "finance" },
  { name: "LineChart", Icon: LineChart, category: "finance" },
  { name: "PieChart", Icon: PieChart, category: "finance" },
  { name: "Activity", Icon: Activity, category: "finance" },
  // People & Team
  { name: "Users", Icon: Users, category: "people" },
  { name: "User", Icon: User, category: "people" },
  { name: "UserCheck", Icon: UserCheck, category: "people" },
  { name: "UserPlus", Icon: UserPlus, category: "people" },
  { name: "Handshake", Icon: Handshake, category: "people" },
  { name: "Award", Icon: Award, category: "people" },
  { name: "Star", Icon: Star, category: "people" },
  { name: "Trophy", Icon: Trophy, category: "people" },
  { name: "Medal", Icon: Medal, category: "people" },
  // Tech & Product
  { name: "Cpu", Icon: Cpu, category: "tech" },
  { name: "Code", Icon: Code, category: "tech" },
  { name: "Globe", Icon: Globe, category: "tech" },
  { name: "Wifi", Icon: Wifi, category: "tech" },
  { name: "Shield", Icon: Shield, category: "tech" },
  { name: "Lock", Icon: Lock, category: "tech" },
  { name: "Database", Icon: Database, category: "tech" },
  { name: "Server", Icon: Server, category: "tech" },
  { name: "Cloud", Icon: Cloud, category: "tech" },
  { name: "Smartphone", Icon: Smartphone, category: "tech" },
  { name: "Monitor", Icon: Monitor, category: "tech" },
  { name: "Laptop", Icon: Laptop, category: "tech" },
  // Arrows & Direction
  { name: "ArrowUp", Icon: ArrowUp, category: "arrows" },
  { name: "ArrowDown", Icon: ArrowDown, category: "arrows" },
  { name: "ArrowRight", Icon: ArrowRight, category: "arrows" },
  { name: "ArrowLeft", Icon: ArrowLeft, category: "arrows" },
  { name: "ArrowUpRight", Icon: ArrowUpRight, category: "arrows" },
  { name: "ArrowRightLeft", Icon: ArrowRightLeft, category: "arrows" },
  { name: "RefreshCw", Icon: RefreshCw, category: "arrows" },
  { name: "RotateCcw", Icon: RotateCcw, category: "arrows" },
  // Symbols
  { name: "CheckCircle", Icon: CheckCircle, category: "symbols" },
  { name: "XCircle", Icon: XCircle, category: "symbols" },
  { name: "AlertCircle", Icon: AlertCircle, category: "symbols" },
  { name: "Info", Icon: Info, category: "symbols" },
  { name: "HelpCircle", Icon: HelpCircle, category: "symbols" },
  { name: "Circle", Icon: Circle, category: "symbols" },
  { name: "Square", Icon: Square, category: "symbols" },
  { name: "Triangle", Icon: Triangle, category: "symbols" },
  { name: "Hexagon", Icon: Hexagon, category: "symbols" },
  { name: "ChevronUp", Icon: ChevronUp, category: "symbols" },
  // Actions & Ideas
  { name: "Target", Icon: Target, category: "actions" },
  { name: "Rocket", Icon: Rocket, category: "actions" },
  { name: "Lightbulb", Icon: Lightbulb, category: "actions" },
  { name: "Magnet", Icon: Magnet, category: "actions" },
  { name: "Flame", Icon: Flame, category: "actions" },
  { name: "Heart", Icon: Heart, category: "actions" },
  { name: "ThumbsUp", Icon: ThumbsUp, category: "actions" },
  { name: "MessageCircle", Icon: MessageCircle, category: "actions" },
  { name: "Mail", Icon: Mail, category: "actions" },
  { name: "Phone", Icon: Phone, category: "actions" },
  { name: "Search", Icon: Search, category: "actions" },
  { name: "Zap", Icon: Zap, category: "actions" },
  // Data & Layout
  { name: "LayoutGrid", Icon: LayoutGrid, category: "data" },
  { name: "List", Icon: List, category: "data" },
  { name: "Table", Icon: Table, category: "data" },
  { name: "Filter", Icon: Filter, category: "data" },
  { name: "SortAsc", Icon: SortAsc, category: "data" },
  { name: "Calendar", Icon: Calendar, category: "data" },
  { name: "Clock", Icon: Clock, category: "data" },
  // Industry
  { name: "Building", Icon: Building, category: "industry" },
  { name: "Building2", Icon: Building2, category: "industry" },
  { name: "Factory", Icon: Factory, category: "industry" },
  { name: "Store", Icon: Store, category: "industry" },
  { name: "ShoppingCart", Icon: ShoppingCart, category: "industry" },
  { name: "Package", Icon: Package, category: "industry" },
  { name: "Truck", Icon: Truck, category: "industry" },
  { name: "Plane", Icon: Plane, category: "industry" },
  { name: "Map", Icon: Map, category: "industry" },
  { name: "MapPin", Icon: MapPin, category: "industry" },
];

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "finance", label: "Finance" },
  { id: "people", label: "People" },
  { id: "tech", label: "Tech" },
  { id: "arrows", label: "Arrows" },
  { id: "symbols", label: "Symbols" },
  { id: "actions", label: "Actions" },
  { id: "data", label: "Data" },
  { id: "industry", label: "Industry" },
];

interface IconPickerProps {
  onSelect: (iconName: string) => void;
}

export default function IconPicker({ onSelect }: IconPickerProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return ICON_CATALOG.filter((ic) => {
      const matchesSearch = !search || ic.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = category === "all" || ic.category === category;
      return matchesSearch && matchesCat;
    });
  }, [search, category]);

  return (
    <div className="space-y-2">
      {/* Search */}
      <input
        className="w-full h-7 px-2 text-xs border rounded bg-background"
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Category pills */}
      <div className="flex flex-wrap gap-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
              category === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto">
        {filtered.map(({ name, Icon }) => (
          <button
            key={name}
            title={name}
            className="h-8 w-8 flex items-center justify-center rounded border hover:bg-primary/10 hover:border-primary transition-colors"
            onClick={() => onSelect(name)}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-6 text-xs text-muted-foreground text-center py-4">No icons found</p>
        )}
      </div>
    </div>
  );
}
