import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Trash2, Package, ShieldAlert, Download } from 'lucide-react';
import { toast } from 'sonner';
import { INTEREST_OPTIONS, DATING_GOALS, EDUCATION_OPTIONS, CAPITALS } from '@/lib/constants';
import { FORBIDDEN_WORDS_DEFAULT, exportToCsv } from '@/lib/admin-mock-data';

interface EditableListProps {
  items: string[];
  onAdd: (item: string) => void;
  onDelete: (item: string) => void;
  noun: string;
}

function EditableList({ items, onAdd, onDelete, noun }: EditableListProps) {
  const [newItem, setNewItem] = useState('');
  const handleAdd = () => {
    const trimmed = newItem.trim();
    if (trimmed && !items.includes(trimmed)) {
      onAdd(trimmed);
      setNewItem('');
      toast.success(`${noun} добавлен`);
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase">
        <span>Всего: {items.length}</span>
        <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs" onClick={() => {
          exportToCsv(`${noun}.csv`, items.map(i => ({ [noun]: i })));
          toast.success('CSV скачан');
        }}><Download size={12} className="mr-1" /> CSV</Button>
      </div>
      <div className="flex flex-wrap gap-2 p-4 rounded-2xl border bg-muted/30 min-h-[120px]">
        {items.map((item) => (
          <Badge key={item} variant="secondary" className="text-sm py-1.5 px-3 flex items-center gap-2 border bg-background shadow-sm">
            {item}
            <button onClick={() => { onDelete(item); toast.success('Удалено'); }} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 size={13} />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Input placeholder={`Новый ${noun.toLowerCase()}...`} value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} className="h-10 rounded-xl" />
        <Button onClick={handleAdd} disabled={!newItem.trim()} className="rounded-xl h-10 px-6"><Plus size={16} className="mr-1" /> Добавить</Button>
      </div>
    </div>
  );
}

export default function ContentManagementPage() {
  const [interests, setInterests] = useState<string[]>([...INTEREST_OPTIONS]);
  const [goals, setGoals] = useState<string[]>([...DATING_GOALS]);
  const [education, setEducation] = useState<string[]>([...EDUCATION_OPTIONS]);
  const [cities, setCities] = useState<string[]>([...CAPITALS]);
  const [forbiddenWords, setForbiddenWords] = useState<string[]>([...FORBIDDEN_WORDS_DEFAULT]);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Управление контентом
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="interests" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-muted/50 rounded-xl mb-6">
              <TabsTrigger value="interests" className="rounded-lg py-2 font-bold text-xs">Интересы ({interests.length})</TabsTrigger>
              <TabsTrigger value="goals" className="rounded-lg py-2 font-bold text-xs">Цели ({goals.length})</TabsTrigger>
              <TabsTrigger value="education" className="rounded-lg py-2 font-bold text-xs">Образование ({education.length})</TabsTrigger>
              <TabsTrigger value="cities" className="rounded-lg py-2 font-bold text-xs">Города ({cities.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="interests">
              <EditableList items={interests} noun="Интерес" onAdd={i => setInterests(p => [...p, i])} onDelete={i => setInterests(p => p.filter(x => x !== i))} />
            </TabsContent>
            <TabsContent value="goals">
              <EditableList items={goals} noun="Цель" onAdd={i => setGoals(p => [...p, i])} onDelete={i => setGoals(p => p.filter(x => x !== i))} />
            </TabsContent>
            <TabsContent value="education">
              <EditableList items={education} noun="Уровень" onAdd={i => setEducation(p => [...p, i])} onDelete={i => setEducation(p => p.filter(x => x !== i))} />
            </TabsContent>
            <TabsContent value="cities">
              <EditableList items={cities} noun="Город" onAdd={i => setCities(p => [...p, i])} onDelete={i => setCities(p => p.filter(x => x !== i))} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Forbidden Words */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            Фильтр запрещённых слов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EditableList items={forbiddenWords} noun="Слово" onAdd={w => setForbiddenWords(p => [...p, w])} onDelete={w => setForbiddenWords(p => p.filter(x => x !== w))} />
        </CardContent>
      </Card>
    </div>
  );
}
