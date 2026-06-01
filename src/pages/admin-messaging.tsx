import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Mail, Bell, Download, Globe, Loader as Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateMockCampaigns, exportToCsv, type MockCampaign } from '@/lib/admin-mock-data';

const STATUS_BADGE: Record<string, string> = {
  sent: 'bg-emerald-100 text-emerald-800',
  scheduled: 'bg-blue-100 text-blue-800',
  draft: 'bg-gray-100 text-gray-800',
};

export default function AdminMessagingPage() {
  const [campaigns, setCampaigns] = useState<MockCampaign[]>(generateMockCampaigns);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('all');
  const [channel, setChannel] = useState('push');
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!title || !body) { toast.error('Заполните все поля'); return; }
    setIsSending(true);
    setTimeout(() => {
      const newCampaign: MockCampaign = {
        id: campaigns.length + 1,
        title, body, target: target as MockCampaign['target'],
        channel: channel as MockCampaign['channel'],
        status: 'sent', sentAt: new Date().toISOString().split('T')[0],
        delivered: Math.floor(Math.random() * 8000) + 2000,
        opened: Math.floor(Math.random() * 3000) + 500,
        clicked: Math.floor(Math.random() * 800) + 100,
      };
      setCampaigns(prev => [newCampaign, ...prev]);
      setTitle(''); setBody('');
      setIsSending(false);
      toast.success('Сообщение отправлено');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> Рассылка
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Канал</Label>
              <Select value={channel} onValueChange={setChannel}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="push"><Bell size={14} className="inline mr-1" /> Push</SelectItem>
                  <SelectItem value="email"><Mail size={14} className="inline mr-1" /> Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Аудитория</Label>
              <Select value={target} onValueChange={setTarget}>
                <SelectTrigger className="h-10 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все пользователи</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="new">Новые (7 дней)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Заголовок</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Заголовок..." className="h-10 rounded-xl" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Текст сообщения</Label>
            <Textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Текст..." className="min-h-[120px] rounded-xl" />
          </div>
        </CardContent>
        <CardFooter className="border-t p-4 flex justify-end">
          <Button onClick={handleSend} disabled={isSending || !title || !body} className="rounded-full h-10 px-8 font-bold">
            {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Отправить
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-black">История рассылок</CardTitle>
          <Button variant="outline" size="sm" className="rounded-xl h-8" onClick={() => {
            exportToCsv('campaigns.csv', campaigns.map(c => ({ Заголовок: c.title, Канал: c.channel, Аудитория: c.target, Статус: c.status, Дата: c.sentAt, Доставлено: c.delivered, Открыто: c.opened, Клики: c.clicked })));
            toast.success('CSV скачан');
          }}><Download size={12} className="mr-1" /> CSV</Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Заголовок</TableHead>
                <TableHead className="hidden sm:table-cell">Канал</TableHead>
                <TableHead className="hidden md:table-cell">Аудитория</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="hidden md:table-cell">Доставлено</TableHead>
                <TableHead className="hidden lg:table-cell">Открыто</TableHead>
                <TableHead className="hidden lg:table-cell">Клики</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium text-sm max-w-[250px] truncate">{c.title}</TableCell>
                  <TableCell className="hidden sm:table-cell"><Badge variant="outline" className="text-[9px]">{c.channel}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-xs">{c.target}</TableCell>
                  <TableCell><Badge className={`text-[9px] border-0 ${STATUS_BADGE[c.status]}`}>{c.status}</Badge></TableCell>
                  <TableCell className="hidden md:table-cell text-xs">{c.delivered.toLocaleString()}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs">{c.opened.toLocaleString()}</TableCell>
                  <TableCell className="hidden lg:table-cell text-xs">{c.clicked.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
