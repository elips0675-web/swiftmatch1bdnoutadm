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
import { useLanguage } from '@/context/language-context';

interface EditableListProps {
  items: string[];
  onAdd: (item: string) => void;
  onDelete: (item: string) => void;
  nounKey: string;
}

function EditableList({ items, onAdd, onDelete, nounKey }: EditableListProps) {
  const { t } = useLanguage();
  const [newItem, setNewItem] = useState('');
  const handleAdd = () => {
    const trimmed = newItem.trim();
    if (trimmed && !items.includes(trimmed)) {
      onAdd(trimmed);
      setNewItem('');
      toast.success(t('admin.content.added'));
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase">
        <span>{t('admin.content.total')}: {items.length}</span>
        <Button variant="ghost" size="sm" className="ml-auto h-7 text-xs" onClick={() => {
          exportToCsv(`${nounKey}.csv`, items.map(i => ({ [nounKey]: i })));
          toast.success(t('admin.content.csv_downloaded'));
        }}><Download size={12} className="mr-1" /> CSV</Button>
      </div>
      <div className="flex flex-wrap gap-2 p-4 rounded-2xl border bg-muted/30 min-h-[120px]">
        {items.map((item) => (
          <Badge key={item} variant="secondary" className="text-sm py-1.5 px-3 flex items-center gap-2 border bg-background shadow-sm">
            {t(item)}
            <button onClick={() => { onDelete(item); toast.success(t('admin.content.deleted')); }} className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 size={13} />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Input placeholder={t('admin.content.new_placeholder')} value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} className="h-10 rounded-xl" />
        <Button onClick={handleAdd} disabled={!newItem.trim()} className="rounded-xl h-10 px-6"><Plus size={16} className="mr-1" /> {t('admin.content.add')}</Button>
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
            {t('admin.content.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="interests" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-muted/50 rounded-xl mb-6">
              <TabsTrigger value="interests" className="rounded-lg py-2 font-bold text-xs">{t('admin.content.tab_interests')} ({interests.length})</TabsTrigger>
              <TabsTrigger value="goals" className="rounded-lg py-2 font-bold text-xs">{t('admin.content.tab_goals')} ({goals.length})</TabsTrigger>
              <TabsTrigger value="education" className="rounded-lg py-2 font-bold text-xs">{t('admin.content.tab_education')} ({education.length})</TabsTrigger>
              <TabsTrigger value="cities" className="rounded-lg py-2 font-bold text-xs">{t('admin.content.tab_cities')} ({cities.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="interests">
              <EditableList items={interests} nounKey="interests" onAdd={i => setInterests(p => [...p, i])} onDelete={i => setInterests(p => p.filter(x => x !== i))} />
            </TabsContent>
            <TabsContent value="goals">
              <EditableList items={goals} nounKey="goals" onAdd={i => setGoals(p => [...p, i])} onDelete={i => setGoals(p => p.filter(x => x !== i))} />
            </TabsContent>
            <TabsContent value="education">
              <EditableList items={education} nounKey="education" onAdd={i => setEducation(p => [...p, i])} onDelete={i => setEducation(p => p.filter(x => x !== i))} />
            </TabsContent>
            <TabsContent value="cities">
              <EditableList items={cities} nounKey="cities" onAdd={i => setCities(p => [...p, i])} onDelete={i => setCities(p => p.filter(x => x !== i))} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-black flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            {t('admin.content.forbidden_words')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EditableList items={forbiddenWords} nounKey="words" onAdd={w => setForbiddenWords(p => [...p, w])} onDelete={w => setForbiddenWords(p => p.filter(x => x !== w))} />
        </CardContent>
      </Card>
    </div>
  );
}
