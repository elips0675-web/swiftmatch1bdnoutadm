import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

interface FeatureFlag {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  affectedUsers: number;
}

const INITIAL_FLAGS: FeatureFlag[] = [
  { key: 'videoCalls', label: 'Видеозвонки', description: 'Разрешить видеозвонки между пользователями в чатах', enabled: true, affectedUsers: 12480 },
  { key: 'aiIcebreakers', label: 'AI Icebreakers', description: 'Предлагать AI-сгенерированные фразы для начала диалога', enabled: true, affectedUsers: 12480 },
  { key: 'aiBioGeneration', label: 'AI Генерация био', description: 'Автоматическое создание описания профиля с помощью AI', enabled: false, affectedUsers: 0 },
  { key: 'aiCompatibility', label: 'AI Анализ совместимости', description: 'Показывать анализ совместимости при создании нового мэтча', enabled: true, affectedUsers: 8200 },
  { key: 'groupsPage', label: 'Страница Групп', description: 'Включить раздел "Группы" в приложении', enabled: true, affectedUsers: 12480 },
  { key: 'contests', label: 'Конкурсы', description: 'Включить еженедельные конкурсы фото и голосования', enabled: true, affectedUsers: 6500 },
  { key: 'premiumTiers', label: 'Premium тарифы', description: 'Управление Plus/Gold/Platinum подписками', enabled: true, affectedUsers: 2100 },
];

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState(INITIAL_FLAGS);
  const [saved, setSaved] = useState(INITIAL_FLAGS);

  const toggle = (key: string) => {
    setFlags(prev => prev.map(f => f.key === key ? { ...f, enabled: !f.enabled } : f));
  };

  const hasChanges = JSON.stringify(flags) !== JSON.stringify(saved);

  const handleSave = () => {
    setSaved(flags);
    toast.success('Настройки сохранены');
  };

  const handleReset = () => {
    setFlags(saved);
    toast.info('Изменения сброшены');
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          Feature Flags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {flags.map(flag => (
          <div key={flag.key} className="flex items-center justify-between gap-4 p-4 rounded-2xl border bg-background hover:bg-muted/5 transition-colors">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <Label htmlFor={flag.key} className="text-sm font-bold cursor-pointer">{flag.label}</Label>
                <Badge variant="outline" className="text-[9px]">{flag.affectedUsers.toLocaleString()} users</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{flag.description}</p>
            </div>
            <Switch id={flag.key} checked={flag.enabled} onCheckedChange={() => toggle(flag.key)} />
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex items-center justify-end gap-3 border-t bg-muted/5 px-6 py-4">
        <Button variant="ghost" onClick={handleReset} disabled={!hasChanges} className="rounded-full text-xs font-bold h-10 px-6">
          <RotateCcw className="mr-2 h-3 w-3" /> Сброс
        </Button>
        <Button onClick={handleSave} disabled={!hasChanges} className="min-w-[140px] rounded-full bg-primary text-primary-foreground font-bold h-10 px-8">
          <Save className="mr-2 h-3 w-3" /> Сохранить
        </Button>
      </CardFooter>
    </Card>
  );
}
