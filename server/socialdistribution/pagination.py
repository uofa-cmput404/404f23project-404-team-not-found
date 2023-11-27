from rest_framework import pagination
from rest_framework.response import Response
from rest_framework import status


class CustomPageNumberPagination(pagination.PageNumberPagination):
    # page_size is default page size
    # max_page_size does not allow user to request the page unreasonably big
    page_size = 10
    page_size_query_param = "size"
    max_page_size = 1000
    page_query_param = "page"

    def get_paginated_response(self, data):
        if data["type"] in ["posts"]:
            return Response(
                data["items"],
                status=status.HTTP_200_OK,
            )
        elif data["type"] in ["inbox"]:
            return Response(
                {
                    "type": data["type"],
                    "author": data["author"],
                    "items": data["items"],
                },
                status=status.HTTP_200_OK,
            )
        elif data["type"] in ["comments"]:
            return Response(
                {
                    "type": data["type"],
                    "page": self.page.number,
                    # TODO: Recheck if size is the correctly implemented
                    # - Is Size the size of the list of all items all of the current page?
                    "size": len(data["items"]),
                    "post": data["post"],
                    "id": data["id"],
                    "comments": data["items"],
                }
            )
        else:
            return Response(
                {
                    "type": data["type"],
                    "items": data["items"],
                    # TODO: Keep those following lines in case we need them later
                    # "count": self.page.paginator.count,
                    # "next": self.get_next_link(),
                    # "previous": self.get_previous_link(),
                },
                status=status.HTTP_200_OK,
            )
