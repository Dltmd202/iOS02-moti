//
//  MotiAPI.swift
//
//
//  Created by Kihyun Lee on 11/13/23.
//

import Foundation
import Domain

enum MotiAPI: EndpointProtocol {
    // 공용
    case version
    case login(requestValue: LoginRequestValue)
    case autoLogin(requestValue: AutoLoginRequestValue)
    case saveImage(requestValue: SaveImageRequestValue)
    // 개인
    case fetchAchievementList(requestValue: FetchAchievementListRequestValue?)
    case fetchCategoryList
    case addCategory(requestValue: AddCategoryRequestValue)
    case fetchDetailAchievement(requestValue: FetchDetailAchievementRequestValue)
    case deleteAchievement(requestValue: DeleteAchievementRequestValue)
    case updateAchievement(requestValue: UpdateAchievementRequestValue)
    case postAchievement(requestValue: PostAchievementRequestValue)
    // 그룹
    case fetchGroupList
    case createGroup(requestValue: CreateGroupRequestValue)
    case fetchGroupAchievementList(requestValue: FetchAchievementListRequestValue?, groupId: Int)
    case fetchGroupCategoryList(groupId: Int)
    case addGroupCategory(requestValue: AddCategoryRequestValue, groupId: Int)
    case fetchGroupDetailAchievement(requestValue: FetchDetailAchievementRequestValue, groupId: Int)
    case deleteGroupAchievement(requestValue: DeleteAchievementRequestValue, groupId: Int)
    case updateGroupAchievement(requestValue: UpdateAchievementRequestValue, groupId: Int)
    case postGroupAchievement(requestValue: PostAchievementRequestValue, groupId: Int)

    private var keychainStorage: KeychainStorageProtocol {
        return KeychainStorage.shared
    }
}

extension MotiAPI {
    var version: String {
        return "v1"
    }
    
    var baseURL: String {
        return Bundle.main.object(forInfoDictionaryKey: "BASE_URL") as! String + "/api/\(version)"
    }
    
    var path: String {
        switch self {
        case .version: return "/operate/policy"
        case .login: return "/auth/login"
        case .autoLogin: return "/auth/refresh"
        case .fetchAchievementList: return "/achievements"
        case .fetchCategoryList: return "/categories"
        case .addCategory: return "/categories"
        case .fetchDetailAchievement(let requestValue): return "/achievements/\(requestValue.id)"
        case .saveImage: return "/images"
        case .deleteAchievement(let requestValue): return "/achievements/\(requestValue.id)"
        case .updateAchievement(let requestValue): return "/achievements/\(requestValue.id)"
        case .postAchievement: return "/achievements"
        case .fetchGroupList: return "/groups"
        case .createGroup: return "/groups"
        case .fetchGroupAchievementList(_, let groupId):
            return "/groups/\(groupId)/achievements"
        case .fetchGroupCategoryList(let groupId):
            return "/groups/\(groupId)/categories"
        case .addGroupCategory(_, let groupId):
            return "/groups/\(groupId)/categories"
        case .fetchGroupDetailAchievement(let requestValue, let groupId):
            return "/groups/\(groupId)/achievements/\(requestValue.id)"
        case .deleteGroupAchievement(let requestValue, let groupId):
            return "/groups/\(groupId)/achievements/\(requestValue.id)"
        case .updateGroupAchievement(let requestValue, let groupId):
            return "/groups/\(groupId)/achievements/\(requestValue.id)"
        case .postGroupAchievement(_, let groupId):
            return "/groups/\(groupId)/achievements"
        }
    }
    
    var method: HttpMethod {
        switch self {
        case .version: return .get
        case .login: return .post
        case .autoLogin: return .post
        case .fetchAchievementList: return .get
        case .fetchCategoryList: return .get
        case .addCategory: return .post
        case .fetchDetailAchievement: return .get
        case .saveImage: return .post
        case .deleteAchievement: return .delete
        case .updateAchievement: return .put
        case .postAchievement: return .post
        case .fetchGroupList: return .get
        case .createGroup: return .post
        case .fetchGroupAchievementList: return .get
        case .fetchGroupCategoryList: return .get
        case .addGroupCategory: return .post
        case .fetchGroupDetailAchievement: return .get
        case .deleteGroupAchievement: return .delete
        case .updateGroupAchievement: return .put
        case .postGroupAchievement: return .post
        }
    }
    
    var queryParameters: Encodable? {
        switch self {
        case .fetchAchievementList(let requestValue):
            return requestValue
        default:
            return nil
        }
    }
    
    var bodyParameters: Encodable? {
        switch self {
        case .login(let requestValue):
            return requestValue
        case .autoLogin(let requestValue):
            return requestValue
        case .addCategory(let requestValue):
            return requestValue
        case .updateAchievement(let requestValue):
            return requestValue.body
        case .postAchievement(let requestValue):
            return requestValue
        case .createGroup(let requestValue):
            return requestValue
        case .addGroupCategory(let requestValue, _):
            return requestValue
        case .updateGroupAchievement(let requestValue, _):
            return requestValue.body
        case .postGroupAchievement(let requestValue, _):
            return requestValue
        default:
            return nil
        }
    }
    
    var headers: [String: String]? {
        var header: [String: String] = [:]
        
        // Content-Type
        switch self {
        case .saveImage(let requestValue):
            header["Content-Type"] = "multipart/form-data; boundary=\(requestValue.boundary)"
        default:
            header["Content-Type"] = "application/json"
        }
        
        // Authorization
        switch self {
        case .version, .login:
            break
        default:
            if let accessTokenData = keychainStorage.read(key: .accessToken),
               let accessToken = String(data: accessTokenData, encoding: .utf8) {
                header["Authorization"] = "Bearer \(accessToken)"
            }
        }
        
        return header
    }
}
