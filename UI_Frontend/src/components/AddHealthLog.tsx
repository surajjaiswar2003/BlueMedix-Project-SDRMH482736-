import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { FoodSuggestionDropdown } from './FoodSuggestionDropdown';

const formSchema = z.object({
  date: z.string(),
  breakfast: z.object({
    name: z.string(),
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
  }),
  lunch: z.object({
    name: z.string(),
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
  }),
  dinner: z.object({
    name: z.string(),
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
  }),
  afternoonSnack: z.object({
    name: z.string(),
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
  }),
  eveningSnack: z.object({
    name: z.string(),
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
  }),
});

export function AddHealthLog() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      breakfast: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0 },
      lunch: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0 },
      dinner: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0 },
      afternoonSnack: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0 },
      eveningSnack: { name: '', calories: 0, protein: 0, carbs: 0, fat: 0 },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch('/api/health-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to add health log');
      }

      form.reset();
      // Show success message or redirect
    } catch (error) {
      console.error('Error adding health log:', error);
      // Show error message
    }
  };

  const renderMealFields = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'afternoonSnack' | 'eveningSnack') => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium capitalize">{mealType.replace(/([A-Z])/g, ' $1').trim()}</h3>
      
      <FormField
        control={form.control}
        name={`${mealType}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meal/Recipe Name</FormLabel>
            <FormControl>
              <FoodSuggestionDropdown
                value={field.value}
                onChange={(value, nutritionData) => {
                  field.onChange(value);
                  if (nutritionData) {
                    form.setValue(`${mealType}.calories`, nutritionData.calories);
                    form.setValue(`${mealType}.protein`, nutritionData.protein);
                    form.setValue(`${mealType}.carbs`, nutritionData.carbs);
                    form.setValue(`${mealType}.fat`, nutritionData.fat);
                  }
                }}
                placeholder="Search for food..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`${mealType}.calories`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calories</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${mealType}.protein`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Protein (g)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${mealType}.carbs`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Carbs (g)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`${mealType}.fat`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fat (g)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Add Health Log</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {renderMealFields('breakfast')}
          {renderMealFields('lunch')}
          {renderMealFields('dinner')}
          {renderMealFields('afternoonSnack')}
          {renderMealFields('eveningSnack')}

          <Button type="submit">Add Health Log</Button>
        </form>
      </Form>
    </div>
  );
} 