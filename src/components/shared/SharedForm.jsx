import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { ImageUpload } from "./ImageUpload";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";


export const SharedForm = ({ 
    formConfig, 
    title,
    calendarMonth,
    setCalendarMonth,
    showErrors
}) => {

    const [showClickableDropdown, setShowClickableDropdown] = useState(false);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            const dropdown = document.getElementById('searchable-dropdown');
            if (dropdown && !dropdown.contains(event.target)) {
                setShowClickableDropdown(false);
            }
        }
        if (showClickableDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showClickableDropdown]);

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().split("T")[0];
    };

    return (
        
        <div className="flex flex-col gap-2 overflow-y-auto min-w-full sm:min-w-[unset] sm:max-w-[800px] self-center p-2">
            {formConfig.map((field, index) => (
                !field.doNotRenderCondition && (
                <div key={index} className="flex flex-col gap-1">
                    <label className={`text-lg font-medium`} style={field.type === 'bool' || field.type === 'image' ? { display: 'none' } : {}}>{field.label} {field.required && <span className="text-red-400">*</span>}</label>
                    {field.type === 'date' ?
                        <div className="flex items-center space-x-2">
                            <Input
                                type="date"
                                placeholder="MM/dd/yyyy"
                                value={formatDate(field.value)}
                                onChange={field.onInputChange}
                                className="flex-1"
                                disabled={field.disabled}
                            />
                            <Popover open={field.open} onOpenChange={field.setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className={cn("h-9 px-3", !field.value && "text-muted-foreground")}
                                        disabled={field.disabled}
                                    >
                                        <CalendarIcon className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={(date) => {
                                        if (date) {
                                            field.onSelectChange?.(date);
                                            field.setOpen?.(false);
                                        }
                                        }}
                                        captionLayout="dropdown"
                                        month={calendarMonth}
                                        onMonthChange={setCalendarMonth}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    : field.type === 'dropdown' ?
                        <div className="flex flex-col items-end gap-1">
                            <Select onValueChange={field.onChange} value={field.value} disabled={field.disabled}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={field.placeholder} />
                                </SelectTrigger>
                                <SelectContent className={`bg-(--background) relative w-full rounded-md`}>
                                    {field.searchOptions && <Input 
                                        placeholder="Search..." 
                                        value={field.searchString} 
                                        onChange={(e) => field.setSearchString(e.target.value)}
                                        className={`!w-full rounded-md sticky top-0 z-10 bg-(--background)`}
                                    />}
                                    <SelectItem value={null} disabled>{field.placeholder}</SelectItem>
                                    {!!field.options ? field.options?.filter(option => option.label?.toLowerCase().includes(field.searchString?.toLowerCase() ?? '')).map((option, idx) => (
                                        <SelectItem key={idx} value={option.value} className={'cursor-pointer hover:bg-(--transparent-bg)'}>{option.label}</SelectItem>
                                    )) : (
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                    )}
                                </SelectContent>
                            </Select>
                            <span onClick={() => field.onChange(null)} className={`text-xs cursor-pointer text-blue-500 ${!!field.value ? 'opacity-100' : 'opacity-0'}`}>Clear</span>
                        </div>
                    : field.type === 'searchable' ?
                        <div className="relative flex gap-2" id="searchable-dropdown">
                            <Input
                                id="date"
                                disabled={field.disabled}
                                value={field.value}
                                placeholder={field.placeholder}
                                className="bg-background pr-10"
                                onChange={field.onInputChange}
                                onFocus={() => setShowClickableDropdown(true)}
                                onKeyDown={(e) => {
                                    if (e.key === "ArrowDown") {
                                    e.preventDefault()
                                    setShowClickableDropdown(true)
                                    }
                                }}
                                />
                                {!!field?.options && showClickableDropdown &&
                                <div className="absolute top-full left-0 right-0 z-10 max-h-60 overflow-y-auto border border-(--border) bg-(--card) shadow-md mt-1">
                                    {field.value?.length >= 2 ?
                                    !!field.options ? field.options?.map((option, idx) => (
                                        <div className="p-2" onClick={() => { field.onSelectChange(option.value); setShowClickableDropdown(false); }}>{option.label}</div>
                                    )) : (
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                    ) : null}
                                </div>}
                        </div>
                    : field.type === 'bool' ?

                        <div className="relative flex gap-2">
                            <div className="flex flex-row items-center gap-2 cursor-pointer">
                                <Checkbox id={field.id} checked={field.value} onCheckedChange={field.onChange} className={'cursor-pointer data-[state=checked]:bg-(--primary)/60'} disabled={field.disabled} />
                                <Label htmlFor={field.id} className={'text-lg cursor-pointer'} onClick={field.onChange}>{field.label}</Label>
                            </div>
                        </div>
                    : field.type === 'image' ?
                        <div className="mt-[-1rem]">
                            <ImageUpload
                                label={field.label}
                                image={field.value}
                                onImageChange={field.onChange}
                                showErrors={showErrors}
                            />
                        </div>
                    : field.type === 'textarea' ?
                        <Textarea
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={field.placeholder}
                            className="w-full"
                            disabled={field.disabled}
                            rows={3}
                        />
                    :
                        <Input
                            type={field.type}
                            value={field.formattedValue ?? field.value}
                            onChange={field.onChange}
                            placeholder={field.placeholder}
                            className="w-full"
                            disabled={field.disabled}
                        />
                    }
                    <p className={`text-red-400 text-sm ${showErrors && field.required && !field.isValidState ? 'opacity-100' : 'opacity-0'} transition-opacity ease-in-out duration-300`}>
                        {field.validationMessage ?? 'n/a'}
                    </p>
                </div>
            )))}
            </div>
    )
}
