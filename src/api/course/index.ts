import { coursesAddress } from "../address";
import { apiRequest } from "../axios";
import { postCourse } from "./register";
import { Courses, Course } from "./type";

//코스 정보
export const getCourse = (params: string): Promise<Courses> => apiRequest("get", `${coursesAddress.get}?${params}`);

/**여행지 상세정보 조회하기*/
export const getCourseDetail = (postId: number): Promise<Course> =>
  apiRequest("get", `${coursesAddress.get}/${postId}`);

/**코스 등록*/
export const postCourses = (data: postCourse): Promise<postCourse> => apiRequest("post", coursesAddress.get, data);
