db.reviews.aggregate([
  {
    $match: {
      DateSubmitted: { $type: "date" }
    }
  },
  {
    $group: {
      _id: "$RecipeId",
      HolidayReviewCount: {
        $sum: {
          $cond: [{ $in: [{ $month: "$DateSubmitted" }, [11, 12]] }, 1, 0]
        }
      }
    }
  },
  {
    $set: { RecipeId: "$_id" }
  },
  {
    $unset: "_id"
  },
  {
    $merge: {
      into: "recipes",
      on: "RecipeId",
      whenMatched: "merge",
      whenNotMatched: "discard"
    }
  }
]);

db.recipes.updateMany(
  { RecipeInstructions: { $type: "array" } },
  [
    {
      $set: {
        InstructionCount: { $size: "$RecipeInstructions" }
      }
    }
  ]
);