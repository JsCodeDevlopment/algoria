pub fn two_sum(nums: &[i32], target: i32) -> Vec<i32> {
    let mut seen: std::collections::HashMap<i32, i32> = std::collections::HashMap::new();
    for i in 0..nums.len() {
        let complement = target - nums[i];
        if let Some(&j) = seen.get(&complement) {
            return vec![j, i as i32];
        }
        seen.insert(nums[i], i as i32);
    }
    vec![]
}
