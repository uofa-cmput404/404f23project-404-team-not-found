from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from socialdistribution.auth.node_authentication import (
    NodeAuthentication,
    NodeIsAuthenticated,
)

# TODO: Can have the following list in .env
LOCAL_NODE_REFERERS = ["http://allowed1.com", "http://allowed2.com"]


def get_custom_authenticators(request):
    if request.META.get("HTTP_REFERER") in LOCAL_NODE_REFERERS:
        return [BasicAuthentication()]  # For local node referers
    else:
        return [NodeAuthentication()]  # For remote addresses using Node model


def get_custom_permissions(request):
    referer = request.META.get("HTTP_REFERER")

    # This code will requires basic auth on the local node referers addresses.
    # For remote addresses, do the auth based on Node model?
    # if referer in LOCAL_NODE_REFERERS:
    #     return [IsAuthenticated()]
    # else:
    #     return []
    if request.META.get("HTTP_REFERER") in LOCAL_NODE_REFERERS:
        return [IsAuthenticated()]  # For local node referers
    else:
        return [NodeIsAuthenticated()]  # For remote addresses using Node model
