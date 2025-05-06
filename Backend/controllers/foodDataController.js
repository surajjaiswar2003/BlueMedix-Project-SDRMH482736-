const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Load the food_snack_value dataset
const loadFoodDataset = () => {
    try {
        const dataPath = path.join(__dirname, '../data/food_snack_value.csv');
        const results = [];
        
        return new Promise((resolve, reject) => {
            fs.createReadStream(dataPath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    resolve(results);
                })
                .on('error', (error) => {
                    console.error('Error reading CSV file:', error);
                    reject(error);
                });
        });
    } catch (error) {
        console.error('Error loading food dataset:', error);
        return null;
    }
};

// Get nutrition data for a food item
const getFoodNutritionData = async (req, res) => {
    try {
        const { foodName } = req.params;
        const foodDataset = await loadFoodDataset();

        if (!foodDataset) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error loading food dataset' 
            });
        }

        // Normalize the search term
        const searchName = foodName.toLowerCase().trim().replace(/\s+/g, ' ');
        
        // Find the food item in the dataset with flexible matching
        const foodItem = foodDataset.find(item => {
            const itemName = item.food_name.toLowerCase().trim().replace(/\s+/g, ' ');
            
            // Check for exact match
            if (itemName === searchName) {
                return true;
            }
            
            // Check for partial matches
            if (itemName.includes(searchName) || searchName.includes(itemName)) {
                return true;
            }
            
            // Check for common variations
            const variations = [
                itemName.replace(/\s+/g, ''),
                itemName.replace(/\s+/g, '-'),
                itemName.replace(/\s+/g, '_')
            ];
            
            return variations.some(variation => 
                variation === searchName || 
                variation.includes(searchName) || 
                searchName.includes(variation)
            );
        });

        if (!foodItem) {
            return res.status(404).json({ 
                success: false, 
                message: 'Food item not found in dataset' 
            });
        }

        // Return the nutrition data
        res.json({
            success: true,
            data: {
                calories: parseFloat(foodItem.unit_serving_energy_kcal),
                protein: parseFloat(foodItem.unit_serving_protein_g),
                carbs: parseFloat(foodItem.unit_serving_carb_g),
                fats: parseFloat(foodItem.unit_serving_fat_g)
            }
        });

    } catch (error) {
        console.error('Error getting food nutrition data:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

module.exports = {
    getFoodNutritionData
}; 