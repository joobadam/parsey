"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/lib/hooks/use-categories";

export default function ReceiptManualForm({ onFormDataChange }) {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [formData, setFormData] = useState({
    merchant: "",
    amount: "",
    date: "",
    category_id: "",
    type: "expense",
    description: "",
  });

  useEffect(() => {
    if (!formData.date) {
      const today = new Date().toISOString().split("T")[0];
      setFormData((prev) => ({
        ...prev,
        date: today,
      }));
    }
  }, []);

  useEffect(() => {
    if (formData.description && categories && categories.length > 0) {
      const suggestedCategory = suggestCategory(
        formData.description,
        formData.merchant,
        categories
      );
      if (suggestedCategory && !formData.category_id) {
        setFormData((prev) => ({
          ...prev,
          category_id: suggestedCategory.id,
        }));
      }
    }
  }, [formData.description, formData.merchant, categories]);

  
  useEffect(() => {
    if (formData.category_id && categories) {
      const selectedCat = categories.find((c) => c.id === formData.category_id);
      if (selectedCat?.name.toLowerCase().includes("other") && formData.ai_categorized) {
        console.warn("⚠️ Category suggestion failed, please select manually");
      }
    }
  }, [formData.category_id, formData.ai_categorized, categories]);

  useEffect(() => {
    const hasData = Object.values(formData).some(
      (value) => value !== "" && value !== "expense"
    );
    if (hasData) {
      onFormDataChange(formData);
    } else {
      onFormDataChange(null);
    }
  }, [formData, onFormDataChange]);

  const handleChange = (key, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "type" && updated.category_id) {
        const filteredCategories = categories?.filter((cat) => cat.type === value);
        if (filteredCategories && filteredCategories.length > 0) {
          if (!filteredCategories.find((cat) => cat.id === updated.category_id)) {
            updated.category_id = "";
          }
        } else {
          updated.category_id = "";
        }
      }
      return updated;
    });
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--color-card-border)] p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
          Merchant
        </label>
        <Input
          value={formData.merchant}
          onChange={(e) => handleChange("merchant", e.target.value)}
          placeholder="Enter merchant name"
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
            Amount
          </label>
          <Input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            placeholder="0.00"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
            Date
          </label>
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
            Category
          </label>
          <Select
            value={formData.category_id || ""}
            onValueChange={(value) => handleChange("category_id", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select a category"} />
            </SelectTrigger>
            <SelectContent>
              {categoriesLoading ? (
                <SelectItem value="" disabled>Loading categories...</SelectItem>
              ) : (
                categories
                  ?.filter((cat) => cat.type === formData.type)
                  .map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
            Type
          </label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
          Description
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter description (optional)"
          className="w-full"
          rows={3}
        />
      </div>
    </div>
  );
}

export function suggestCategory(description, merchant, categories) {
  if (!description || !categories) {
    const expenseCategories = categories?.filter((c) => c.type === "expense") || [];
    return expenseCategories.find((c) => c.name.toLowerCase().includes("other")) || expenseCategories[0] || null;
  }

  const desc = description.toLowerCase().trim();
  const merch = merchant?.toLowerCase().trim() || "";

  const expenseCategories = categories.filter((c) => c.type === "expense");

  if (expenseCategories.length === 0) return null;

  const keywords = {
    food: [
      "food",
      "restaurant",
      "grocery",
      "cafe",
      "coffee",
      "pizza",
      "burger",
      "lunch",
      "dinner",
      "bakery",
      "supermarket",
      "market",
      "mcdonalds",
      "kfc",
      "subway",
      "starbucks",
      "restaurant",
      "étterem",
      "kávézó",
      "élelmiszer",
      "zöldség",
      "hús",
      "bevásárlás",
      "szupermarket",
      "abc",
      "pizzeria",
      "vendéglő",
      "büfé",
      "kocsma",
      "sörözö",
    ],
    entertainment: [
      "movie",
      "cinema",
      "game",
      "entertainment",
      "spotify",
      "netflix",
      "gaming",
      "theater",
      "concert",
      "ticket",
      "steam",
      "playstation",
      "xbox",
      "playstation store",
      "film",
      "mozival",
      "játék",
      "szórakozás",
      "előadás",
      "koncert",
    ],
    travel: [
      "flight",
      "hotel",
      "taxi",
      "uber",
      "bus",
      "train",
      "travel",
      "airline",
      "airport",
      "airbnb",
      "booking",
      "expedia",
      "car rental",
      "gas",
      "parking",
      "transport",
      "ferry",
      "utazás",
      "szálloda",
      "repülő",
      "vonat",
      "busz",
      "benzin",
      "parkolás",
      "taxi",
      "uber",
    ],
    shopping: [
      "shop",
      "mall",
      "store",
      "amazon",
      "clothing",
      "buy",
      "purchase",
      "market",
      "retail",
      "fashion",
      "shoes",
      "clothes",
      "department store",
      "ebay",
      "zara",
      "h&m",
      "gap",
      "bolt",
      "nákup",
      "ruha",
      "cipő",
      "divatáru",
      "áruház",
    ],
    health: [
      "doctor",
      "pharmacy",
      "hospital",
      "medicine",
      "health",
      "medical",
      "clinic",
      "dentist",
      "cvs",
      "walgreens",
      "therapist",
      "vaccine",
      "prescription",
      "lab",
      "orthopedist",
      "orvos",
      "gyógyszertár",
      "kórház",
      "fogászat",
      "egészség",
      "fogorvos",
    ],
    personal: [
      "salon",
      "barber",
      "personal",
      "care",
      "shampoo",
      "cosmetic",
      "beauty",
      "hair",
      "spa",
      "gym",
      "fitness",
      "wellness",
      "massage",
      "trainer",
      "szalon",
      "fodrász",
      "kozmetika",
      "fitness",
      "edzőterem",
      "masszázs",
    ],
  };


  const scores = {};

  for (const [catName, keywordList] of Object.entries(keywords)) {
    scores[catName] = 0;

    keywordList.forEach((keyword) => {
      if (merch.includes(keyword)) {
        scores[catName] += 3;
      }
      if (desc.includes(keyword)) {
        scores[catName] += 1;
      }
    });
  }


  console.log("Category scores:", scores, "Merchant:", merch, "Desc:", desc);


  let bestCategoryName = null;
  let bestScore = 0;

  for (const [catName, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCategoryName = catName;
    }
  }

  if (bestCategoryName && bestScore > 0) {
    const foundCategory = expenseCategories.find((c) =>
      c.name.toLowerCase().includes(bestCategoryName)
    );
    if (foundCategory) {
      console.log("Suggested category:", foundCategory.name, "Score:", bestScore);
      return foundCategory;
    }
  }

  const otherCategory = expenseCategories.find((c) =>
    c.name.toLowerCase().includes("other")
  );
  console.log("No match found, using fallback:", otherCategory?.name || expenseCategories[0]?.name);
  return otherCategory || expenseCategories[0];
}

