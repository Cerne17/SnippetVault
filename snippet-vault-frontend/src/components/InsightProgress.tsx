import { Shield, Sparkles, Wand2, Zap } from 'lucide-react';

interface InsightProgressProps {
    points?: number;
}

export default function InsightProgress({ points = 0 }: InsightProgressProps) {
    let currentRank = { label: 'Initiate', icon: Shield, threshold: 0, nextThreshold: 10, color: 'text-slate-500' };

    if (points >= 500) {
        currentRank = { label: 'Sage', icon: Wand2, threshold: 500, nextThreshold: Infinity, color: 'text-purple-600 dark:text-purple-400' };
    } else if (points >= 100) {
        currentRank = { label: 'Guardian', icon: Shield, threshold: 100, nextThreshold: 500, color: 'text-indigo-600 dark:text-indigo-400' };
    } else if (points >= 10) {
        currentRank = { label: 'Expert', icon: Sparkles, threshold: 10, nextThreshold: 100, color: 'text-emerald-600 dark:text-emerald-400' };
    }

    const isMaxRank = currentRank.nextThreshold === Infinity;
    const progress = isMaxRank
        ? 100
        : Math.min(100, Math.max(0, ((points - currentRank.threshold) / (currentRank.nextThreshold - currentRank.threshold)) * 100));

    const needed = isMaxRank ? 0 : currentRank.nextThreshold - points;
    const Icon = currentRank.icon;

    return (
        <div className="flex flex-col gap-1.5 min-w-[180px] group">
            <div className="flex items-center justify-between gap-x-6 text-[10px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-slate-900 dark:text-white">{points} Insights</span>
                </div>
                {!isMaxRank && (
                    <span className="text-slate-400 group-hover:text-primary transition-colors">
                        {needed} more to {currentRank.label === 'Initiate' ? 'Expert' : currentRank.label === 'Expert' ? 'Guardian' : 'Sage'}
                    </span>
                )}
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700">
                <div
                    className={`h-full transition-all duration-500 ease-out rounded-full ${currentRank.label === 'Sage' ? 'bg-purple-500' :
                        currentRank.label === 'Guardian' ? 'bg-indigo-500 dark:bg-indigo-400' :
                            currentRank.label === 'Expert' ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-slate-400'
                        }`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="flex items-center gap-1">
                <Icon className={`w-2.5 h-2.5 ${currentRank.color}`} />
                <span className={`text-[9px] font-bold uppercase tracking-tighter ${currentRank.color}`}>
                    Current Rank: {currentRank.label}
                </span>
            </div>
        </div>
    );
}
