//
//  GroupHomeActionState.swift
//
//
//  Created by 유정주 on 11/30/23.
//

import Foundation
import Domain

extension GroupHomeViewModel {
    enum GroupHomeViewModelAction {
        case launch
        case addCategory(name: String)
        case fetchNextPage
        case fetchAchievementList(category: CategoryItem)
        case refreshAchievementList
        case logout
    }
    
    enum CategoryListState {
        case loading
        case finish
        case error(message: String)
    }
    
    enum AddCategoryState {
        case loading
        case finish
        case error(message: String)
    }
    
    enum AchievementListState {
        case loading
        case finish
        case error(message: String)
    }
}
