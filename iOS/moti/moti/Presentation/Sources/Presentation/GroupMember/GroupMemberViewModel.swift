//
//  GroupMemberViewModel.swift
//
//
//  Created by Kihyun Lee on 12/5/23.
//

import Foundation
import Domain
import Core

final class GroupMemberViewModel {
    enum GroupMemberViewModelAction {
        case launch
    }
    
    enum LaunchState {
        case initial
        case success
        case failed(message: String)
    }
    
    typealias GroupMemberDataSource = ListDiffableDataSource<GroupMember>
    
    // MARK: - Properties
    private var groupMemberDataSource: GroupMemberDataSource?
    private var groupMembers: [GroupMember] = [] {
        didSet {
            groupMemberDataSource?.update(data: groupMembers)
        }
    }
    
    private let fetchGroupMemberListUseCase: FetchGroupMemberListUseCase
    
    @Published private(set) var launchState: LaunchState = .initial
    
    private let group: Group
    
    init(
        fetchGroupMemberListUseCase: FetchGroupMemberListUseCase,
        group: Group
    ) {
        self.fetchGroupMemberListUseCase = fetchGroupMemberListUseCase
        self.group = group
    }
    
    func setupDataSource(_ dataSource: GroupMemberDataSource) {
        self.groupMemberDataSource = dataSource
        groupMemberDataSource?.update(data: [])
    }
    
    func action(_ action: GroupMemberViewModelAction) {
        switch action {
        case .launch:
            fetchGroupMemberList()
        }
    }
    
    private func fetchGroupMemberList() {
        Task {
            do {
                let groupMembers = try await fetchGroupMemberListUseCase.execute(
                    requestValue: FetchGroupMemberListRequestValue(groupId: group.id))
                self.groupMembers = groupMembers
                launchState = .success
            } catch {
                Logger.debug("group members fetch error: \(error)")
                launchState = .failed(message: error.localizedDescription)
            }
        }
    }
}
