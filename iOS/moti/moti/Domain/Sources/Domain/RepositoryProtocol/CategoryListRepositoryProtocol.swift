//
//  CategoryListRepositoryProtocol.swift
//
//
//  Created by 유정주 on 11/22/23.
//

import Foundation

public protocol CategoryListRepositoryProtocol {
    func fetchCategoryList() async throws -> [CategoryItem]
    func addCategory(requestValue: AddCategoryRequestValue) async throws -> CategoryItem
}
